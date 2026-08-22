import { Context } from '@deepseek-ai/cordis'
import { CallId } from '@deepseek-ai/dsh-llm'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as AntvPlugin from '../src/index.js'
import { SKILL_CONTENT } from '../src/skill.js'

const signal = new AbortController().signal

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('dsh-plugin-chart', () => {
  it('mounts the skill and executes the native tool through real registries', async () => {
    expect(AntvPlugin.name).toBe('dsh-chart')

    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              success: true,
              resultObj: 'https://example.com/generated.png',
            }),
          ),
      ),
    )

    const ctx = new Context()
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    await ctx.plugin(SkillRegistry)
    const fiber = await ctx.plugin(AntvPlugin)

    expect(await ctx.skills.list()).toEqual([
      expect.objectContaining({
        name: 'chart-visualization',
        provider: 'dsh-plugin-chart',
        source: 'bundled',
      }),
    ])
    expect((await ctx.skills.get('chart-visualization'))?.content).toBe(SKILL_CONTENT)
    const chartTool = ctx.tools.get('antv_chart')
    expect(chartTool).toBeDefined()
    expect(chartTool?.presentCall?.({ spec: { type: 'pie' } })).toMatchObject({
      title: 'Generate AntV pie chart',
      kind: 'execute',
    })

    const result = await ctx.tools.execute({
      signal,
      callId: CallId('dsh-chart-test'),
      name: 'antv_chart',
      arguments: {
        spec: {
          type: 'pie',
          data: [{ category: 'A', value: 1 }],
        },
      },
    })

    expect(result).toMatchObject({
      isError: false,
      value: { type: 'pie', url: 'https://example.com/generated.png' },
      content: [{ type: 'text', text: '![AntV pie chart](https://example.com/generated.png)' }],
    })

    await fiber.dispose()
    expect(ctx.tools.get('antv_chart')).toBeUndefined()
    expect(await ctx.skills.list()).toEqual([])
  })

  it('rejects unsupported chart types before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const ctx = new Context()
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    await ctx.plugin(SkillRegistry)
    await ctx.plugin(AntvPlugin)

    const result = await ctx.tools.execute({
      signal,
      callId: CallId('dsh-chart-invalid'),
      name: 'antv_chart',
      arguments: { spec: { type: 'three-dimensional-pie', data: [] } },
    })

    expect(result.isError).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
