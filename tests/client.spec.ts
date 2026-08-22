import { describe, expect, it, vi } from 'vitest'
import { requestAntvChart } from '../src/client.js'
import { resolveConfig } from '../src/config.js'

const SPEC = {
  type: 'line',
  data: [{ time: '2026-08', value: 42 }],
  title: 'Example',
} as const

describe('requestAntvChart', () => {
  it('posts the spec, owns the source marker, and normalizes the URL', async () => {
    const fetchMock = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      expect(init?.method).toBe('POST')
      expect(init?.headers).toEqual({ 'content-type': 'application/json' })
      expect(JSON.parse(String(init?.body))).toEqual({
        ...SPEC,
        source: 'chart-visualization-skills',
      })
      return new Response(
        JSON.stringify({
          success: true,
          resultObj: 'https://example.com/chart.png',
        }),
        { headers: { 'content-type': 'application/json' } },
      )
    })

    await expect(
      requestAntvChart({ ...SPEC, source: 'untrusted-override' }, resolveConfig(), {
        fetch: fetchMock,
      }),
    ).resolves.toEqual({
      type: 'line',
      url: 'https://example.com/chart.png',
    })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('reports non-success API payloads', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            message: 'invalid data',
          }),
        ),
    )

    await expect(requestAntvChart(SPEC, resolveConfig(), { fetch: fetchMock })).rejects.toThrow(
      'AntV chart API rejected the request: invalid data',
    )
  })

  it('reports HTTP errors with a bounded response summary', async () => {
    const fetchMock = vi.fn(async () => new Response('gateway unavailable', { status: 503 }))

    await expect(requestAntvChart(SPEC, resolveConfig(), { fetch: fetchMock })).rejects.toThrow(
      'HTTP 503: gateway unavailable',
    )
  })

  it.each([
    ['not-json', 'invalid JSON'],
    ['[]', 'non-object JSON payload'],
    [JSON.stringify({ success: true }), 'no resultObj image URL'],
    [JSON.stringify({ success: true, resultObj: 'not a URL' }), 'invalid resultObj image URL'],
    [
      JSON.stringify({ success: true, resultObj: 'data:image/png;base64,AA==' }),
      'non-HTTP image URL',
    ],
  ])('rejects malformed success responses %#', async (body, message) => {
    const fetchMock = vi.fn(async () => new Response(body))
    await expect(requestAntvChart(SPEC, resolveConfig(), { fetch: fetchMock })).rejects.toThrow(
      message,
    )
  })

  it('enforces the configured response limit while streaming', async () => {
    const fetchMock = vi.fn(async () => new Response('x'.repeat(2_000)))
    const config = resolveConfig({ maxResponseBytes: 1_024 })

    await expect(requestAntvChart(SPEC, config, { fetch: fetchMock })).rejects.toThrow(
      'response exceeds 1024 bytes',
    )
  })

  it('distinguishes cancellation from transport failure', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchMock = vi.fn(async () => {
      throw new DOMException('aborted', 'AbortError')
    })

    await expect(
      requestAntvChart(SPEC, resolveConfig(), {
        fetch: fetchMock,
        signal: controller.signal,
      }),
    ).rejects.toThrow('request was canceled')
  })

  it('reports its own request timeout', async () => {
    const fetchMock = vi.fn(
      async (_input: string | URL | Request, init?: RequestInit): Promise<Response> => {
        await new Promise((resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
          setTimeout(resolve, 100)
        })
        return new Response('{}')
      },
    )

    await expect(
      requestAntvChart(SPEC, resolveConfig({ requestTimeoutMs: 1 }), { fetch: fetchMock }),
    ).rejects.toThrow('timed out after 1 ms')
  })

  it('wraps transport errors', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('connection reset')
    })

    await expect(requestAntvChart(SPEC, resolveConfig(), { fetch: fetchMock })).rejects.toThrow(
      'request failed: connection reset',
    )
  })
})
