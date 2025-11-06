# API Cost Guard

**AI API 成本监控和优化工具** - 帮助开发者实时监控、预测和优化AI API使用成本

## ✨ 特性

- 🚀 **实时监控** - 终端内快速查看API使用情况
- 💰 **成本预测** - 智能预测月度API支出
- 💡 **优化建议** - 自动生成成本优化建议
- 🔒 **安全存储** - 本地加密存储API密钥
- 📊 **多平台支持** - OpenAI、Claude、Google AI
- 🌐 **Web仪表板** - 深度分析和团队协作 (计划中)

## 🚀 快速开始

### 安装

```bash
npm install -g api-cost-guard
```

### 初始化

```bash
api-cost init
```

### 查看状态

```bash
api-cost status
```

## 📋 命令参考

```bash
# 初始化配置
api-cost init

# 查看当前状态
api-cost status

# 成本预测
api-cost predict

# 获取优化建议
api-cost suggest

# 查看历史记录
api-cost history

# 设置预算
api-cost budget set 200

# 开启/关闭警报
api-cost alert on
api-cost alert off

# 生成报告
api-cost report

# 查看帮助
api-cost --help
```

## 📊 支持的API提供商

- ✅ OpenAI (GPT-3.5, GPT-4, DALL-E)
- ✅ Anthropic Claude (Claude-2, Claude-3)
- 🔄 Google AI (Gemini) - 开发中

## 🔧 配置

配置文件位置：`~/.api-cost/config.json`

```json
{
  "apis": {
    "openai": {
      "apiKey": "sk-...",
      "models": ["gpt-4", "gpt-3.5-turbo"]
    },
    "claude": {
      "apiKey": "sk-ant-...",
      "models": ["claude-3-sonnet", "claude-3-haiku"]
    }
  },
  "budget": {
    "monthly": 200,
    "alertThreshold": 0.8
  },
  "alerts": true
}
```

## 📈 使用示例

```bash
# 快速查看今天的使用情况
$ api-cost status
📊 Today: $12.34 | Month: $156.78 | Budget: 78% used
⚡ Top model: gpt-4 (45%) | gpt-3.5-turbo (55%)

# 获取优化建议
$ api-cost suggest
💡 Switch to gpt-3.5-turbo for simple tasks: Save ~$45/month
💡 Enable prompt caching: Save ~$23/month
📊 Total potential savings: $68/month

# 预测月度成本
$ api-cost predict
📈 Projected monthly cost: $234.56
⚠️  Over budget by $34.56
```

## 🛠️ 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourname/api-cost-guard.git
cd api-cost-guard

# 安装依赖
npm install

# 运行测试
npm test

# 本地运行CLI
npm link
api-cost --help
```

### 项目结构

```
api-cost-guard/
├── cli/                 # CLI工具源码
│   ├── src/
│   │   ├── commands/    # CLI命令
│   │   ├── services/    # 核心服务
│   │   ├── utils/       # 工具函数
│   │   └── types/       # 类型定义
│   ├── package.json
│   └── README.md
├── web/                 # Web仪表板 (计划中)
├── docs/                # 文档
├── examples/            # 使用示例
└── tests/               # 测试文件
```

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

### 开发流程

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 🔗 相关链接

- [问题反馈](https://github.com/yourname/api-cost-guard/issues)
- [功能请求](https://github.com/yourname/api-cost-guard/discussions)
- [更新日志](CHANGELOG.md)

## 🙏 致谢

- 感谢所有贡献者
- 感谢 OpenAI、Anthropic 等API提供商
- 灵感来源于开发者的真实需求

---

**⭐ 如果这个项目对你有帮助，请给个星标！**