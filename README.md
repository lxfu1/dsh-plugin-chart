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
A coffee shop's beverage sales breakdown is: coffee 60%, tea 25%, and juice 15%.
Please visualize this beverage sales data using a pie chart and add corresponding text labels.
```
<img width="766" height="627" alt="image" src="https://github.com/user-attachments/assets/3bb6328a-dbd1-4116-8f1a-fae0cf5f59ca" />

### Organization chart

```text
Please use AntV to generate an organizational chart titled "Xinghe Technology Organizational Structure," using a vertical layout.
Zhang Chen is the CEO, responsible for the company's overall strategy. The CEO oversees three centers:
1. Product Center, headed by Li Ran; subordinate to Wang Min (Product Design) and Chen Tao (User Growth).
2. Technology Center, headed by Zhou Yu; subordinate to Zhao Lei (Platform R&D) and Sun Yue (Data Intelligence).
3. Business Center, headed by Lin Lan; subordinate to He Feng (Enterprise Sales) and Zheng Xin (Customer Success).
```
<img width="1316" height="273" alt="image" src="https://github.com/user-attachments/assets/c7d116bb-5470-4fb5-b48d-5c1fad042826" />

### Invoke the skill explicitly

To explicitly request the chart capability, enter:

```text
/chart-visualization
The following are the monthly sales figures for various beverages at a chain coffee shop in 2025, in thousands of cups:
Coffee: January 128, February 135, March 142, April 150, May 163, June 178, July 192, August 188, September 176, October 169, November 158, December 151.
Tea: January 82, February 86, March 91, April 98, May 110, June 126, July 143, August 151, September 147, October 132, November 108, December 94.
Fruit Juice: January 45, February 48, March 55, April 68, May 92, June 126, July 158, August 171, September 149, October 103, November 66, December 50.
Seasonal Limited-Time Drinks: January 30, February 34, March 40, April 52, May 75, June 105, July 138, August 146, September 119, October 80, November 48, December 35.

Please use a multi-series line chart to display the annual sales trend of the four beverage categories. Set the chart title to "Monthly Sales Trend of Various Beverage Categories in 2025," with the horizontal axis representing months and the vertical axis representing sales volume (thousands of cups). Please use easily distinguishable colors for different beverages, display legends and data points, and retain the actual values ​​for each month.
```
<img width="761" height="408" alt="image" src="https://github.com/user-attachments/assets/bc143a6e-fcda-499f-b176-6964dc38e3a0" />


## Supported charts

`area`, `bar`, `boxplot`, `column`, `dual-axes`, `fishbone-diagram`, `flow-diagram`, `funnel`, `histogram`, `liquid`, `line`, `mind-map`, `network-graph`, `organization-chart`, `pie`, `radar`, `sankey`, `scatter`, `spreadsheet`, `treemap`, `venn`, `violin`, `waterfall`, and `word-cloud`.


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
