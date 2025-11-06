# 更新日志

本文档记录了API Cost Guard的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 初始版本开发中

## [0.1.0] - 2024-01-XX

### 新增
- 初始CLI工具发布
- 支持OpenAI、Claude、Google AI API
- 基础成本监控功能
- 成本预测和优化建议
- 预算管理和警报
- 多种报告格式 (JSON, Markdown, CSV)
- 安全的API密钥存储
- 交互式配置向导

### 支持的命令
- `api-cost init` - 初始化配置
- `api-cost status` - 查看使用状态
- `api-cost predict` - 成本预测
- `api-cost suggest` - 优化建议
- `api-cost history` - 历史记录
- `api-cost budget` - 预算管理
- `api-cost alert` - 警报管理
- `api-cost report` - 生成报告

### 支持的AI提供商
- OpenAI (GPT-4, GPT-3.5-turbo, DALL-E, Embeddings)
- Anthropic Claude (Claude-3, Claude-2)
- Google AI (Gemini)

### 技术特性
- TypeScript实现
- 本地配置加密存储
- 跨平台支持 (Windows, macOS, Linux)
- 彩色终端输出
- 表格格式化显示
- JSON/CSV数据导出

## [计划中]

### v0.2.0 (计划)
- [ ] Web仪表板
- [ ] 实时API使用监控
- [ ] 更多AI提供商支持
- [ ] 团队协作功能
- [ ] 高级分析功能

### v0.3.0 (计划)
- [ ] VS Code插件
- [ ] API使用限制功能
- [ ] 自定义警报规则
- [ ] 成本异常检测
- [ ] API调用日志

### v1.0.0 (计划)
- [ ] 完整的Web界面
- [ ] 企业级功能
- [ ] 高级安全功能
- [ ] 完整的API文档
- [ ] 性能优化

---

## 版本说明

- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正