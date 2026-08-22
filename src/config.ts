import z from '@deepseek-ai/schemastery'

/** Default public endpoint documented by the upstream AntV chart skill. */
export const DEFAULT_ENDPOINT = 'https://antv-studio.alipay.com/api/gpt-vis'
const MAX_REQUEST_TIMEOUT_MS = 300_000
const MAX_RESPONSE_BYTES = 10 * 1_024 * 1_024

/** Plugin configuration accepted from the Cordis patch layer. */
export interface Config {
  /** AntV-compatible HTTP endpoint. HTTP is permitted for local development servers. */
  endpoint?: string
  /** Per-request timeout in milliseconds. */
  requestTimeoutMs?: number
  /** Maximum response body size accepted from the endpoint. */
  maxResponseBytes?: number
}

/** Cordis configuration schema with deployment defaults. */
export const Config: z<Config> = z.object({
  endpoint: z.string().default(DEFAULT_ENDPOINT),
  requestTimeoutMs: z.natural().min(1).max(MAX_REQUEST_TIMEOUT_MS).default(30_000),
  maxResponseBytes: z.natural().min(1_024).max(MAX_RESPONSE_BYTES).default(65_536),
})

/** Fully validated configuration consumed by the HTTP client and tool. */
export interface ResolvedConfig {
  readonly endpoint: string
  readonly requestTimeoutMs: number
  readonly maxResponseBytes: number
}

/**
 * Resolve direct programmatic configuration and reject invalid endpoint URLs.
 * @param config - optional plugin configuration.
 * @returns validated immutable runtime settings.
 */
export function resolveConfig(config: Config = {}): ResolvedConfig {
  const endpoint = config.endpoint ?? DEFAULT_ENDPOINT
  const requestTimeoutMs = config.requestTimeoutMs ?? 30_000
  const maxResponseBytes = config.maxResponseBytes ?? 65_536
  let parsed: URL
  try {
    parsed = new URL(endpoint)
  } catch (error: unknown) {
    throw new TypeError('dsh-chart: endpoint must be a valid absolute URL', { cause: error })
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new TypeError('dsh-chart: endpoint must use http: or https:')
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    throw new TypeError('dsh-chart: endpoint must not contain embedded credentials')
  }
  assertPositiveInteger('requestTimeoutMs', requestTimeoutMs)
  assertPositiveInteger('maxResponseBytes', maxResponseBytes)
  if (requestTimeoutMs > MAX_REQUEST_TIMEOUT_MS) {
    throw new TypeError(`dsh-chart: requestTimeoutMs must not exceed ${MAX_REQUEST_TIMEOUT_MS}`)
  }
  if (maxResponseBytes < 1_024) {
    throw new TypeError('dsh-chart: maxResponseBytes must be at least 1024')
  }
  if (maxResponseBytes > MAX_RESPONSE_BYTES) {
    throw new TypeError(`dsh-chart: maxResponseBytes must not exceed ${MAX_RESPONSE_BYTES}`)
  }

  return Object.freeze({
    endpoint: parsed.toString(),
    requestTimeoutMs,
    maxResponseBytes,
  })
}

function assertPositiveInteger(field: string, value: number): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`dsh-chart: ${field} must be a positive integer`)
  }
}
