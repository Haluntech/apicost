# Contributing to API Cost Guard

感谢你对 API Cost Guard 的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告问题

- 使用 [GitHub Issues](https://github.com/yourname/api-cost-guard/issues) 报告 bug
- 提供详细的复现步骤
- 包含系统环境信息

### 功能请求

- 使用 [GitHub Discussions](https://github.com/yourname/api-cost-guard/discussions) 讨论新功能
- 描述功能的使用场景
- 说明为什么这个功能有价值

### 代码贡献

#### 开发环境设置

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 fork 仓库
   # 然后克隆你的 fork
   git clone https://github.com/yourusername/api-cost-guard.git
   cd api-cost-guard
   ```

2. **安装依赖**
   ```bash
   cd cli
   npm install
   ```

3. **设置开发环境**
   ```bash
   # 创建本地链接
   npm link
   
   # 运行测试确保一切正常
   npm test
   ```

#### 开发流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发和测试**
   ```bash
   # 编写代码
   # 运行测试
   npm test
   # 运行 lint
   npm run lint
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   # 在 GitHub 上创建 Pull Request
   ```

#### 代码规范

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 规则
- 编写单元测试
- 更新相关文档

#### Commit 消息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建或工具相关
```

## 📁 项目结构

```
api-cost-guard/
├── cli/                 # CLI 工具
│   ├── src/
│   │   ├── commands/    # CLI 命令实现
│   │   ├── services/    # 核心业务逻辑
│   │   ├── utils/       # 工具函数
│   │   └── types/       # TypeScript 类型
│   ├── tests/           # 测试文件
│   └── package.json
├── web/                 # Web 仪表板 (计划中)
├── docs/                # 项目文档
├── examples/            # 使用示例
└── README.md
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "specific test"

# 生成覆盖率报告
npm run test:coverage
```

### 编写测试

- 为新功能编写单元测试
- 测试文件名：`*.test.ts`
- 使用 Jest 测试框架

## 📝 文档

### 更新文档

- README.md：项目概述和快速开始
- API 文档：详细的 API 说明
- 使用示例：实际使用场景

### 文档风格

- 使用清晰的标题结构
- 提供代码示例
- 包含使用场景说明

## 🚀 发布流程

### 版本管理

- 使用语义化版本 (SemVer)
- 更新 CHANGELOG.md
- 创建 Git 标签

### 发布到 npm

```bash
# 构建项目
npm run build

# 发布到 npm
npm publish
```

## 💬 获取帮助

- GitHub Issues：报告问题和请求
- GitHub Discussions：一般讨论和问答
- 查看 [FAQ](docs/FAQ.md) 获取常见问题解答

## 🏆 贡献者

感谢所有为 API Cost Guard 做出贡献的开发者！

## 📄 许可证

通过贡献代码，你同意你的贡献将在 [MIT 许可证](LICENSE) 下发布。

---

再次感谢你的贡献！🙏