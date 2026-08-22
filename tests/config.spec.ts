import { describe, expect, it } from 'vitest'
import { DEFAULT_ENDPOINT, resolveConfig } from '../src/config.js'

describe('resolveConfig', () => {
  it('supplies documented defaults', () => {
    expect(resolveConfig()).toEqual({
      endpoint: DEFAULT_ENDPOINT,
      requestTimeoutMs: 30_000,
      maxResponseBytes: 65_536,
    })
  })

  it('normalizes an HTTP development endpoint', () => {
    expect(resolveConfig({ endpoint: 'http://127.0.0.1:8080/chart' }).endpoint).toBe(
      'http://127.0.0.1:8080/chart',
    )
  })

  it.each([
    [{ endpoint: 'not a url' }, 'endpoint must be a valid absolute URL'],
    [{ endpoint: 'file:///tmp/chart' }, 'endpoint must use http: or https:'],
    [{ endpoint: 'https://user:pass@example.com/chart' }, 'must not contain embedded credentials'],
    [{ requestTimeoutMs: 0 }, 'requestTimeoutMs must be a positive integer'],
    [{ requestTimeoutMs: 1.5 }, 'requestTimeoutMs must be a positive integer'],
    [{ requestTimeoutMs: 300_001 }, 'requestTimeoutMs must not exceed 300000'],
    [{ maxResponseBytes: 512 }, 'maxResponseBytes must be at least 1024'],
    [{ maxResponseBytes: 10_485_761 }, 'maxResponseBytes must not exceed 10485760'],
  ] as const)('rejects invalid config %#', (config, message) => {
    expect(() => resolveConfig(config)).toThrow(message)
  })
})
