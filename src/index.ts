/**
 * DeepSeek Harness bundle plugin for AntV chart visualization.
 * @module dsh-plugin-chart
 */

import type { Context } from '@deepseek-ai/cordis'
import { Config, resolveConfig, type Config as PluginConfig } from './config.js'
import { skillProvider } from './skill.js'
import { createAntvChartTool } from './tool.js'

/** Cordis plugin name. */
export const name = 'dsh-chart'
/** Services supplied by the standard DeepSeek Harness base profile. */
export const inject = ['skills', 'tools'] as const

export { Config }

/** Register the bundled skill provider and native AntV chart tool. */
export function apply(ctx: Context, config: PluginConfig = {}): void {
  const resolved = resolveConfig(config)
  ctx.skills.registerProvider(() => skillProvider)
  ctx.tools.register(createAntvChartTool(resolved))
}
