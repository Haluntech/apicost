# API Cost Guard 使用指南

## 目录

1. [快速开始](#快速开始)
2. [配置说明](#配置说明)
3. [命令详解](#命令详解)
4. [使用场景](#使用场景)
5. [最佳实践](#最佳实践)
6. [故障排除](#故障排除)

## 快速开始

### 1. 安装

```bash
npm install -g api-cost-guard
```

### 2. 初始化配置

```bash
api-cost init
```

按照提示设置：
- 选择使用的AI服务提供商
- 输入API密钥
- 设置月度预算
- 配置警报

### 3. 查看使用状态

```bash
api-cost status
```

## 配置说明

### 支持的AI提供商

#### OpenAI
- **API密钥格式**: `sk-...`
- **支持模型**: GPT-4, GPT-3.5-turbo, DALL-E, Embeddings
- **获取密钥**: https://platform.openai.com/api-keys

#### Anthropic Claude
- **API密钥格式**: `sk-ant-...`
- **支持模型**: Claude-3系列, Claude-2系列
- **获取密钥**: https://console.anthropic.com/

#### Google AI
- **API密钥格式**: 变化，通常较长字符串
- **支持模型**: Gemini系列
- **获取密钥**: https://makersuite.google.com/app/apikey

### 配置文件位置

配置文件存储在：`~/.api-cost/config.json`

```json
{
  "apis": {
    "openai": {
      "name": "openai",
      "displayName": "OpenAI",
      "apiKey": "[加密存储]",
      "models": [],
      "baseUrl": "https://api.openai.com/v1"
    }
  },
  "budget": {
    "monthly": 200,
    "alertThreshold": 0.8,
    "alerts": true
  },
  "currency": "USD",
  "dateFormat": "yyyy-MM-dd"
}
```

## 命令详解

### init - 初始化配置

```bash
api-cost init [--force]
```

**选项：**
- `--force`: 强制覆盖现有配置

**功能：**
- 交互式设置API提供商
- 安全存储API密钥
- 配置预算和警报

### status - 查看使用状态

```bash
api-cost status [--provider <provider>] [--days <days>]
```

**选项：**
- `--provider`: 过滤特定提供商 (openai, claude, google)
- `--days`: 分析天数 (默认: 7)

**输出：**
- 今日/本周/本月费用
- 预测月度费用
- 预算使用情况
- 热门模型使用统计

### predict - 成本预测

```bash
api-cost predict [--confidence]
```

**选项：**
- `--confidence`: 显示置信度

**功能：**
- 基于当前使用模式预测月度费用
- 分析预测因素和置信度
- 预算超支警告

### suggest - 优化建议

```bash
api-cost suggest [--type <type>]
```

**选项：**
- `--type`: 按建议类型过滤

**建议类型：**
- **模型切换**: 使用更便宜的模型
- **提示缓存**: 缓存重复查询
- **批量处理**: 合并小请求
- **使用减少**: 设置使用限制

### history - 历史记录

```bash
api-cost history [--days <days>] [--format <format>]
```

**选项：**
- `--days`: 显示天数 (默认: 30)
- `--format`: 输出格式 (table, json, csv)

### budget - 预算管理

```bash
# 设置月度预算
api-cost budget set 200

# 查看当前预算
api-cost budget show

# 设置警报阈值
api-cost budget threshold 80
```

### alert - 警报管理

```bash
# 开启警报
api-cost alert on

# 关闭警报
api-cost alert off

# 查看警报状态
api-cost alert status
```

### report - 生成报告

```bash
api-cost report [--format <format>] [--output <file>] [--period <period>]
```

**选项：**
- `--format`: 报告格式 (json, markdown, csv)
- `--output`: 输出文件路径
- `--period`: 报告周期 (day, week, month)

## 使用场景

### 场景1: 日常成本监控

```bash
# 每日检查
api-cost status

# 如果费用异常高
api-cost suggest
api-cost history --days 3
```

### 场景2: 预算管理

```bash
# 设置预算
api-cost budget set 500
api-cost budget threshold 75
api-cost alert on

# 定期检查
api-cost predict
```

### 场景3: 成本优化

```bash
# 获取优化建议
api-cost suggest

# 查看详细使用模式
api-cost history --days 30 --format json

# 生成月度报告
api-cost report --format markdown --output monthly-report.md
```

### 场景4: 团队协作

```bash
# 导出配置分享给团队
api-cost config export > team-config.json

# 生成团队报告
api-cost report --format csv --output team-usage.csv
```

## 最佳实践

### 1. 预算设置

```bash
# 根据历史使用设置合理预算
api-cost history --days 30
api-cost budget set [合理的月度预算]

# 设置预警阈值（建议70-80%）
api-cost budget threshold 75
```

### 2. 定期监控

```bash
# 每日检查（可加入脚本）
api-cost status

# 每周深度分析
api-cost suggest
api-cost history --days 7
```

### 3. 优化实施

1. **优先实施低成本建议**
   - 模型切换建议
   - 简单的使用限制

2. **逐步实施复杂优化**
   - 提示缓存系统
   - 批量处理机制

### 4. 报告和分析

```bash
# 月度报告
api-cost report --format markdown --output reports/month-$(date +%Y%m).md

# 数据分析
api-cost history --days 90 --format json > analysis/data.json
```

## 故障排除

### 常见问题

#### 1. "No configuration found"
```bash
# 解决方案
api-cost init
```

#### 2. "Invalid API key format"
- 检查API密钥是否正确
- 确认密钥格式符合提供商要求
- 重新初始化：`api-cost init --force`

#### 3. "No usage data found"
- 确认已配置正确的API密钥
- 检查是否有实际的API调用
- 验证API密钥权限

#### 4. 网络连接问题
```bash
# 检查网络连接
curl -I https://api.openai.com/v1/models

# 如果使用代理，设置环境变量
export HTTPS_PROXY=http://proxy.company.com:8080
```

### 调试模式

```bash
# 启用详细输出
api-cost status --verbose

# 查看原始数据
api-cost history --format json
```

### 重置配置

```bash
# 完全重置（谨慎使用）
api-cost reset
```

## 高级用法

### 自定义脚本

```bash
#!/bin/bash
# daily-check.sh

echo "📊 Daily API Cost Check - $(date)"
api-cost status

if [ $? -ne 0 ]; then
    echo "❌ Status check failed"
    exit 1
fi

echo "💡 Quick suggestions:"
api-cost suggest | head -10
```

### 集成到CI/CD

```yaml
# .github/workflows/cost-check.yml
name: API Cost Check
on:
  schedule:
    - cron: '0 9 * * 1' # 每周一9点

jobs:
  cost-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install API Cost Guard
        run: npm install -g api-cost-guard
      - name: Check costs
        run: api-cost status --json
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## 获取帮助

- **GitHub Issues**: [报告问题](https://github.com/yourname/api-cost-guard/issues)
- **GitHub Discussions**: [社区讨论](https://github.com/yourname/api-cost-guard/discussions)
- **文档**: [完整文档](https://github.com/yourname/api-cost-guard/wiki)

---

*最后更新: 2024年1月*