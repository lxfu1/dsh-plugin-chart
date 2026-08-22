import { defineTool } from '@deepseek-ai/dsh-tools'
import { CHART_TYPES } from './chart-types.js'
import type { ResolvedConfig } from './config.js'
import { requestAntvChart } from './client.js'

/** Create the model-facing AntV chart tool for one resolved deployment config. */
export function createAntvChartTool(config: ResolvedConfig) {
  return defineTool({
    name: 'antv_chart',
    description:
      'Generate a chart image with AntV. Pass one complete chart specification in `spec`; select the chart type and field names according to the chart-visualization skill. The plugin adds the required API source marker. Never include credentials, secrets, or unredacted sensitive personal data.',
    parameters: {
      spec: {
        type: 'object',
        required: true,
        additionalProperties: true,
        description:
          'Complete AntV chart request. Besides `type`, include the chart-specific data and optional title, theme, width, height, axis titles, or style fields.',
        properties: {
          type: {
            type: 'string',
            required: true,
            enum: [...CHART_TYPES],
            description: 'AntV chart type selected from the chart-visualization skill.',
          },
        },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          type: { type: 'string', required: true, enum: [...CHART_TYPES] },
          url: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [
        {
          type: 'text',
          text: `![AntV ${value.type} chart](${value.url})`,
        },
      ],
    },
    async execute(args, exec) {
      return await requestAntvChart(args.spec, config, { signal: exec.signal })
    },
    timeoutMs: config.requestTimeoutMs + 1_000,
    isConcurrencySafe: () => true,
    presentCall: args => ({
      card: 'generic',
      title: `Generate AntV ${args.spec.type} chart`,
      kind: 'execute',
      rawInput: args.spec,
    }),
  })
}
