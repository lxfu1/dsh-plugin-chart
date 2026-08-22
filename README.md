# dsh-plugin-chart

English | [简体中文](README.zh-CN.md)

An unofficial community plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) that creates AntV chart images directly from natural-language requests.

Provide the data and what you want to communicate. The plugin selects a suitable chart and displays the result in the conversation. Supported formats include line, bar, pie, radar, Sankey, organization, network, and flow charts.

> [!IMPORTANT]
> This project is not affiliated with or endorsed by DeepSeek or AntV. DeepSeek Harness is currently a developer preview and may introduce breaking changes.

## Requirements

- Node.js `^22.19.0` or `>=24.0.0`
- pnpm on `PATH`
- DeepSeek Harness `0.1.x`

## Install

Install directly from GitHub into the `web` profile:

```sh
npx @deepseek-ai/dsh plugin --profile web add github:lxfu1/dsh-plugin-chart
```

Git-hosted plugins build from source during installation. On pnpm 10 or later, the first command may ask you to allow the `dsh-plugin-chart` build in the profile's `pnpm-workspace.yaml`; follow the path printed by dsh, add the exact `allowBuilds` key reported by pnpm, and rerun the same command. Only grant build permission to source you trust.

Start the Web app:

```sh
npx @deepseek-ai/dsh web
```

## Examples

### Line chart

```text
Create a line chart titled "Monthly Active Users in Q1 2026" from this data:
January 1.20 million, February 1.48 million, March 1.73 million.
Use month on the horizontal axis and monthly active users on the vertical axis.
```

### Organization chart

```text
Create a vertical organization chart titled "Stellar Technology Organization".
Alex Chen is the CEO, with Product led by Riley Lee, Engineering led by Jordan Zhou,
and Commercial led by Morgan Lin.
Product contains Product Design led by Avery Wang and User Growth led by Taylor Chen.
Engineering contains Platform Engineering led by Cameron Zhao and Data Intelligence led by Sydney Sun.
Commercial contains Enterprise Sales led by Parker He and Customer Success led by Quinn Zheng.
Keep the supplied names and roles, and do not invent missing information.
```

### Invoke the skill explicitly

To explicitly request the chart capability, enter:

```text
/chart-visualization
Create a pie chart for product revenue share: Alpha 42, Beta 31, Gamma 27.
```

### More examples

```text
Create a dual-axis chart for monthly visits and conversion rate:
January 12,000 visits and 3.2%; February 15,600 and 3.8%; March 18,100 and 4.1%.
```

```text
Create a Sankey chart for this user journey:
Home to Product 860, Product to Cart 420, Cart to Payment 260, Payment to Complete 210.
```

## Supported charts

`area`, `bar`, `boxplot`, `column`, `dual-axes`, `fishbone-diagram`, `flow-diagram`, `funnel`, `histogram`, `liquid`, `line`, `mind-map`, `network-graph`, `organization-chart`, `pie`, `radar`, `sankey`, `scatter`, `spreadsheet`, `treemap`, `venn`, `violin`, `waterfall`, and `word-cloud`.

## Use a private chart service

The plugin uses the public AntV GPT-Vis endpoint by default. To process internal data with a compatible private service, configure it in `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- id: dsh-chart
  config:
    endpoint: https://charts.example.com/api/gpt-vis
```

## Data and privacy

Chart data from your prompt is sent to the currently configured chart service. Do not submit passwords, access tokens, private keys, government identifiers, full personal contact details, or unnecessary sensitive business records.

For sensitive data, aggregate or anonymize it first, or use your own compatible service. Image retention and access are governed by the selected service.

## Remove

```sh
npx @deepseek-ai/dsh plugin --profile web remove dsh-plugin-chart
```

## Development

```sh
pnpm install
pnpm check
```

## License

[MIT](LICENSE). Embedded content is adapted from AntV's [`chart-visualization`](https://github.com/antvis/chart-visualization-skills/tree/master/skills/chart-visualization) skill. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution.
