import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { CHART_TYPES } from '../src/chart-types.js'
import { SKILL_CONTENT } from '../src/skill.js'

describe('published package metadata', () => {
  it('declares an installable DeepSeek Harness patch bundle', async () => {
    const manifest = JSON.parse(
      await readFile(new URL('../package.json', import.meta.url), 'utf8'),
    ) as {
      name: string
      dsh?: { bundle?: { patch?: string } }
      exports?: Record<string, unknown>
      files?: string[]
    }
    const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')

    expect(manifest.name).toBe('dsh-plugin-chart')
    expect(manifest.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(manifest.exports).not.toHaveProperty('./client')
    expect(manifest.files).not.toContain('skills')
    expect(patch).toContain('id: dsh-chart')
    expect(patch).toContain('name: dsh-plugin-chart')
  })

  it('keeps the embedded skill chart catalog synchronized with the tool enum', () => {
    for (const chartType of CHART_TYPES) {
      expect(SKILL_CONTENT, `missing chart type ${chartType}`).toContain(`\`${chartType}\``)
    }
  })
})
