# dsh-plugin-chart

[English](README.md) | 简体中文

一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的非官方社区插件，让用户可以直接通过自然语言生成 AntV 图表图片。

你只需要提供数据和想表达的内容，插件会选择合适的图表类型并在对话中展示结果。目前支持折线图、柱状图、饼图、雷达图、桑基图、组织架构图、关系图、流程图等多种图表。

> [!IMPORTANT]
> 本项目与 DeepSeek、AntV 没有官方隶属或背书关系。DeepSeek Harness 目前仍处于开发者预览阶段，相关接口可能发生不兼容变化。

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

### 折线图

```text
请把下面的月活用户数据生成一张折线图，标题为“2026 年第一季度月活趋势”：
1 月 120 万，2 月 148 万，3 月 173 万。
横轴为月份，纵轴为月活用户数。
```

### 组织架构图

```text
请生成一张纵向组织架构图，标题为“星河科技组织架构”。
张晨是 CEO；下设产品中心李然、技术中心周宇、商业中心林岚。
产品中心下设产品设计王敏、用户增长陈涛；
技术中心下设平台研发赵磊、数据智能孙悦；
商业中心下设企业销售何峰、客户成功郑欣。
请保留姓名和职责，不要补充不存在的信息。
```

### 显式调用 Skill

当你希望明确要求 Harness 使用图表能力时，可以输入：

```text
/chart-visualization
请把产品营收占比生成饼图：Alpha 42，Beta 31，Gamma 27。
```

### 更多示例

```text
请把访问量与转化率按月份生成双轴图：
1 月访问量 12000、转化率 3.2%；
2 月访问量 15600、转化率 3.8%；
3 月访问量 18100、转化率 4.1%。
```

```text
请生成一张用户流转桑基图：
首页到商品页 860，商品页到购物车 420，购物车到支付页 260，支付页到完成页 210。
```

## 支持的图表

`area`、`bar`、`boxplot`、`column`、`dual-axes`、`fishbone-diagram`、`flow-diagram`、`funnel`、`histogram`、`liquid`、`line`、`mind-map`、`network-graph`、`organization-chart`、`pie`、`radar`、`sankey`、`scatter`、`spreadsheet`、`treemap`、`venn`、`violin`、`waterfall` 和 `word-cloud`。

## 使用私有图表服务

默认使用 AntV 公共 GPT-Vis 接口。如果需要处理内部数据，可以在 `$DSH_HOME/profiles/web/cordis.patch.yml` 中指定兼容的私有服务：

```yaml
- id: dsh-chart
  config:
    endpoint: https://charts.example.com/api/gpt-vis
```

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
