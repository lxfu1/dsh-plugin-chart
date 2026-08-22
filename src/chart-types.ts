/** Chart types supported by the AntV GPT-Vis endpoint used by this plugin. */
export const CHART_TYPES = [
  'area',
  'bar',
  'boxplot',
  'column',
  'dual-axes',
  'fishbone-diagram',
  'flow-diagram',
  'funnel',
  'histogram',
  'liquid',
  'line',
  'mind-map',
  'network-graph',
  'organization-chart',
  'pie',
  'radar',
  'sankey',
  'scatter',
  'spreadsheet',
  'treemap',
  'venn',
  'violin',
  'waterfall',
  'word-cloud',
] as const

/** Complete request specification forwarded to AntV after the plugin adds its source marker. */
export type ChartSpec = Readonly<Record<string, unknown>> & {
  readonly type: (typeof CHART_TYPES)[number]
}
