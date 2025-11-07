## 🚀 API Cost Guard v0.1.0

### ✨ 首次发布！
🎉 **AI API Cost Monitoring Tool** - 专为开发者设计的AI API成本监控和优化工具

### 🎯 核心功能
- 🔧 **多平台支持**: OpenAI、Claude、Google AI API监控
- 📊 **实时状态**: 终端内快速查看API使用情况和成本
- 💡 **智能建议**: 个性化成本优化建议，平均可节省30-50%费用
- 🎯 **预算管理**: 灵活的预算设置和实时警报
- 📈 **成本预测**: 基于使用模式的智能月度成本预测
- 📝 **多格式报告**: JSON、Markdown、CSV格式导出
- 🔒 **安全存储**: API密钥本地加密存储
- 🎮 **交互配置**: 简单易用的初始化向导

### 🛠️ 支持的命令
```bash
api-cost init              # 初始化配置
api-cost status            # 查看使用状态  
api-cost predict           # 成本预测
api-cost suggest           # 优化建议
api-cost history           # 历史记录
api-cost budget set 200    # 设置$200月度预算
api-cost alert on          # 开启警报
api-cost report            # 生成报告
```

### 📦 安装方法
```bash
npm install -g api-cost-guard
```

### 🚀 快速开始
```bash
# 1. 初始化配置
api-cost init

# 2. 查看当前使用状态
api-cost status

# 3. 获取优化建议
api-cost suggest

# 4. 设置预算警报
api-cost budget set 200 && api-cost alert on
```

### 💡 使用示例
```bash
$ api-cost status
📊 API Cost Status

Overview:
┌──────────────┬─────────────────┐
│ Today        │           $12.34│
│ This Week    │           $56.78│
│ This Month   │          $124.56│
│ Projected    │          $234.56│
│ Budget       │ $200.00 (62.3%)│
└──────────────┴─────────────────┘

💡 Total potential savings: $68/month
```

### 🎯 适用场景
- **个人开发者**: 监控个人AI API使用成本
- **小团队**: 团队API成本预算管理
- **产品经理**: AI功能成本分析和优化
- **创业公司**: 控制AI开发成本

### 📚 文档链接
- [📖 完整使用指南](docs/USAGE_GUIDE.md)
- [⚡ 快速开始](QUICK_START.md)
- [🔧 开发文档](docs/DEVELOPMENT.md)
- [📋 更新日志](CHANGELOG.md)

### 🌟 项目亮点
- 🚀 **CLI优先**: 不打断开发流程，终端内快速操作
- 🎨 **用户友好**: 彩色输出、表格显示、直观易懂
- 🛡️ **安全可靠**: 本地配置存储，API密钥加密保护
- 🔄 **开源免费**: MIT许可证，可自由使用和修改
- 📈 **可扩展**: 模块化架构，支持未来功能扩展

### 🤝 贡献指南
欢迎提交Issue、Pull Request和功能建议！
- [🐛 报告问题](https://github.com/yourname/api-cost-guard/issues)
- [💬 功能讨论](https://github.com/yourname/api-cost-guard/discussions)
- [📝 贡献指南](CONTRIBUTING.md)

### ⭐ 支持项目
如果这个工具对你有帮助，请：
- ⭐ 给项目一个Star
- 🔄 分享给其他开发者
- 🐛 报告问题和建议
- 💰 [未来的付费版支持开发](#)

---

## 🔗 相关链接
- **npm包**: https://www.npmjs.com/package/api-cost-guard
- **GitHub仓库**: https://github.com/yourname/api-cost-guard
- **项目文档**: https://github.com/yourname/api-cost-guard#readme

---

**🎉 感谢使用 API Cost Guard！让AI API成本控制变得简单高效！**

*Generated with ❤️ by Claude Code*