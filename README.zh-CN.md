# dsh-plugin-chart

[English](README.md) | 简体中文

一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的社区插件，让用户可以直接通过自然语言生成 AntV 图表图片。

你只需要提供数据和想表达的内容，插件会选择合适的图表类型并在对话中展示结果。目前支持折线图、柱状图、饼图、雷达图、桑基图、组织架构图、关系图、流程图等多种图表。

## 环境要求

- Node.js `^22.19.0` 或 `>=24.0.0`
- `PATH` 中可用的 pnpm
- DeepSeek Harness `0.1.x`

## 安装

直接从 GitHub 安装到 `web` profile：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:lxfu1/dsh-plugin-chart
```

Git 托管插件会在安装期间从源码构建。pnpm 10 及以上版本可能在第一次执行时要求允许 `dsh-plugin-chart` 的构建脚本；请按照 dsh 输出的路径，在对应 profile 的 `pnpm-workspace.yaml` 中加入 pnpm 提示的准确 `allowBuilds` 键，然后重新执行同一条命令。只应为可信源码授予构建权限。

启动 Web：

```sh
npx @deepseek-ai/dsh web
```

## 使用示例

### 饼图

```text
一家咖啡店的饮品销售比例为：咖啡 60%，茶 25%，果汁 15%。请用环图可视化这些饮品销售数据，并添加对应的文本标签。
```

<img width="768" height="657" alt="咖啡、茶和果汁销售占比环图" src="https://github.com/user-attachments/assets/6f83ef28-07b7-403e-afa1-78bdf735628a" />

### 组织架构图

```text
请使用 AntV 生成一张组织架构图，标题为“星河科技组织架构”，采用纵向布局。
张晨是 CEO，负责公司整体战略。CEO 下设三个中心：
1. 产品中心，负责人李然；下设产品设计王敏、用户增长陈涛。
2. 技术中心，负责人周宇；下设平台研发赵磊、数据智能孙悦。
3. 商业中心，负责人林岚；下设企业销售何峰、客户成功郑欣。

请保留每个人的姓名和职责，不要补充不存在的部门或人员。
```

<img width="1237" height="261" alt="星河科技纵向组织架构图" src="https://github.com/user-attachments/assets/beb54a49-4a09-4ec8-a4d2-fbbf5c675d9b" />

### 显式调用 Skill

当你希望明确要求 Harness 使用图表能力时，可以输入：

```text
/chart-visualization
一家连锁咖啡店 2025 年各类饮品的月度销量如下，单位为千杯：
咖啡：1 月 128，2 月 135，3 月 142，4 月 150，5 月 163，6 月 178，7 月 192，8 月 188，9 月 176，10 月 169，11 月 158，12 月 151。
茶饮：1 月 82，2 月 86，3 月 91，4 月 98，5 月 110，6 月 126，7 月 143，8 月 151，9 月 147，10 月 132，11 月 108，12 月 94。
果汁：1 月 45，2 月 48，3 月 55，4 月 68，5 月 92，6 月 126，7 月 158，8 月 171，9 月 149，10 月 103，11 月 66，12 月 50。
季节限定饮品：1 月 30，2 月 34，3 月 40，4 月 52，5 月 75，6 月 105，7 月 138，8 月 146，9 月 119，10 月 80，11 月 48，12 月 35。
请使用多系列折线图展示四类饮品全年的销量趋势。图表标题设为“2025 年各类饮品月度销量趋势”，横轴为月份，纵轴为销量（千杯）。请为不同饮品使用容易区分的颜色，显示图例和数据点，并保留各月份的真实数值。
```

<img width="1502" height="1084" alt="2025 年各类饮品月度销量趋势折线图" src="https://github.com/user-attachments/assets/e7bd0fdb-c7df-4f43-a081-d1b0cae00dc7" />

## 支持的图表

`area`、`bar`、`boxplot`、`column`、`dual-axes`、`fishbone-diagram`、`flow-diagram`、`funnel`、`histogram`、`liquid`、`line`、`mind-map`、`network-graph`、`organization-chart`、`pie`、`radar`、`sankey`、`scatter`、`spreadsheet`、`treemap`、`venn`、`violin`、`waterfall` 和 `word-cloud`。

## 数据与隐私

生成图表时，提示词中的图表数据会发送到当前配置的图表服务。不要提交密码、访问令牌、私钥、证件号码、完整个人联系方式或不必要的敏感业务记录。

对于敏感数据，建议先完成聚合或匿名化，或者使用自己的兼容服务。生成图片的保留和访问策略以对应服务方的规则为准。

## 卸载

```sh
npx @deepseek-ai/dsh plugin --profile web remove dsh-plugin-chart
```

## 开发

```sh
pnpm install
pnpm check
```

## 许可证

[MIT](LICENSE)。内置内容改编自 AntV 的 [`chart-visualization`](https://github.com/antvis/chart-visualization-skills/tree/master/skills/chart-visualization) Skill，第三方署名见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
