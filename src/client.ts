import type { ChartSpec } from './chart-types.js'
import type { ResolvedConfig } from './config.js'

const REQUEST_SOURCE = 'chart-visualization-skills'

/**
 * Generate one chart through an AntV-compatible GPT-Vis endpoint.
 * @param spec - complete chart specification except for the plugin-owned source marker.
 * @param config - resolved endpoint, timeout, and response-size settings.
 * @param options - optional cancellation and fetch implementation.
 * @returns normalized chart type and image URL.
 */
export async function requestAntvChart(
  spec: ChartSpec,
  config: ResolvedConfig,
  options: {
    readonly signal?: AbortSignal
    readonly fetch?: typeof globalThis.fetch
  } = {},
) {
  const timeoutSignal = AbortSignal.timeout(config.requestTimeoutMs)
  const signal =
    options.signal === undefined ? timeoutSignal : AbortSignal.any([options.signal, timeoutSignal])
  const fetchImpl = options.fetch ?? globalThis.fetch

  let response: Response
  try {
    response = await fetchImpl(config.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...spec, source: REQUEST_SOURCE }),
      signal,
    })
  } catch (error: unknown) {
    if (options.signal?.aborted === true) {
      throw new Error('AntV chart request was canceled', { cause: error })
    }
    if (timeoutSignal.aborted) {
      throw new Error(`AntV chart request timed out after ${config.requestTimeoutMs} ms`, {
        cause: error,
      })
    }
    throw new Error(`AntV chart request failed: ${errorMessage(error)}`, { cause: error })
  }

  const text = await readLimitedText(response, config.maxResponseBytes)
  if (!response.ok) {
    throw new Error(`AntV chart API returned HTTP ${response.status}: ${responseSummary(text)}`)
  }

  const payload = parsePayload(text)
  if (payload.success !== true) {
    throw new Error(`AntV chart API rejected the request: ${payloadError(payload)}`)
  }
  if (typeof payload.resultObj !== 'string' || payload.resultObj.length === 0) {
    throw new Error('AntV chart API returned no resultObj image URL')
  }

  let resultUrl: URL
  try {
    resultUrl = new URL(payload.resultObj)
  } catch (error: unknown) {
    throw new Error('AntV chart API returned an invalid resultObj image URL', { cause: error })
  }
  if (resultUrl.protocol !== 'https:' && resultUrl.protocol !== 'http:') {
    throw new Error('AntV chart API returned a non-HTTP image URL')
  }

  return { type: spec.type, url: resultUrl.toString() }
}

async function readLimitedText(response: Response, maxBytes: number): Promise<string> {
  const declaredLength = response.headers.get('content-length')
  if (declaredLength !== null && Number(declaredLength) > maxBytes) {
    throw new Error(`AntV chart API response exceeds ${maxBytes} bytes`)
  }
  if (response.body === null) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let bytes = 0
  let text = ''

  while (true) {
    const part = await reader.read()
    if (part.done) break
    bytes += part.value.byteLength
    if (bytes > maxBytes) {
      await reader.cancel('response size limit exceeded')
      throw new Error(`AntV chart API response exceeds ${maxBytes} bytes`)
    }
    text += decoder.decode(part.value, { stream: true })
  }

  return text + decoder.decode()
}

function parsePayload(text: string): Record<string, unknown> {
  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch (error: unknown) {
    throw new Error('AntV chart API returned invalid JSON', { cause: error })
  }
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('AntV chart API returned a non-object JSON payload')
  }
  return payload as Record<string, unknown>
}

function payloadError(payload: Record<string, unknown>): string {
  for (const key of ['message', 'error', 'msg']) {
    const value = payload[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return 'unknown API error'
}

function responseSummary(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length === 0) return '<empty response>'
  return normalized.length <= 300 ? normalized : `${normalized.slice(0, 300)}…`
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
