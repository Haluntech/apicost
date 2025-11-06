# 开发文档

## 目录

1. [开发环境设置](#开发环境设置)
2. [项目结构](#项目结构)
3. [架构设计](#架构设计)
4. [贡献指南](#贡献指南)
5. [测试指南](#测试指南)
6. [发布流程](#发布流程)

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- TypeScript (全局安装或使用npx)

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourname/api-cost-guard.git
cd api-cost-guard/cli

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 本地链接CLI工具
npm link
```

### 开发工具配置

#### VS Code
推荐安装以下扩展：
- TypeScript Importer
- ESLint
- Prettier
- Jest Runner

#### 调试配置
创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "args": ["status"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 项目结构

```
api-cost-guard/
├── cli/                     # CLI工具主目录
│   ├── src/
│   │   ├── commands/        # CLI命令实现
│   │   │   ├── init.ts
│   │   │   ├── status.ts
│   │   │   ├── predict.ts
│   │   │   ├── suggest.ts
│   │   │   ├── history.ts
│   │   │   ├── budget.ts
│   │   │   ├── alert.ts
│   │   │   └── report.ts
│   │   ├── services/        # 核心业务逻辑
│   │   │   ├── ConfigService.ts
│   │   │   ├── UsageService.ts
│   │   │   ├── APIService.ts
│   │   │   └── OptimizationService.ts
│   │   ├── utils/           # 工具函数
│   │   │   ├── format.ts
│   │   │   ├── crypto.ts
│   │   │   └── validation.ts
│   │   ├── types/           # TypeScript类型定义
│   │   │   └── index.ts
│   │   └── index.ts         # CLI入口文件
│   ├── tests/               # 测试文件
│   │   ├── commands/
│   │   ├── services/
│   │   └── utils/
│   ├── examples/            # 使用示例
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── web/                     # Web仪表板 (计划中)
├── docs/                    # 项目文档
│   ├── USAGE_GUIDE.md
│   ├── DEVELOPMENT.md
│   └── API.md
└── README.md                # 项目说明
```

## 架构设计

### 整体架构

```
┌─────────────────┐
│   CLI Interface │ ← 用户交互层
│  (Commander.js) │
└─────────────────┘
         ↓
┌─────────────────┐
│  Command Layer  │ ← 命令处理层
│  (Commands/)    │
└─────────────────┘
         ↓
┌─────────────────┐
│  Service Layer  │ ← 业务逻辑层
│  (Services/)    │
└─────────────────┘
         ↓
┌─────────────────┐
│   Data Layer    │ ← 数据存储层
│  (Config/Files) │
└─────────────────┘
```

### 核心组件

#### 1. CLI Interface
- **文件**: `src/index.ts`
- **框架**: Commander.js
- **职责**: 命令解析、参数验证、全局错误处理

#### 2. Command Layer
- **目录**: `src/commands/`
- **职责**: 具体命令实现、用户交互、输出格式化

#### 3. Service Layer
- **目录**: `src/services/`
- **组件**:
  - `ConfigService`: 配置管理、加密存储
  - `UsageService`: 使用数据分析、成本计算
  - `APIService`: 第三方API集成
  - `OptimizationService`: 优化建议生成

#### 4. Utils Layer
- **目录**: `src/utils/`
- **功能**: 格式化、验证、加密等工具函数

### 数据流

```
用户输入 → CLI解析 → Command处理 → Service业务逻辑 → 数据存储/获取 → 格式化输出 → 用户界面
```

## 贡献指南

### 开发流程

1. **创建功能分支**
```bash
git checkout -b feature/new-feature
```

2. **开发和测试**
```bash
# 开发
npm run dev

# 测试
npm test

# 代码检查
npm run lint
```

3. **提交代码**
```bash
git add .
git commit -m "feat: add new feature description"
```

4. **推送和PR**
```bash
git push origin feature/new-feature
# 创建Pull Request
```

### 代码规范

#### TypeScript规范
- 使用严格模式
- 明确的类型注解
- 接口优于类型别名
- 避免使用`any`

#### ESLint规则
- 遵循Airbnb规范
- 使用TypeScript规则
- 自定义项目规则

#### 命名规范
- **文件名**: PascalCase (类名), camelCase (其他)
- **变量名**: camelCase
- **常量名**: UPPER_SNAKE_CASE
- **函数名**: camelCase, 动词开头
- **类名**: PascalCase, 名词开头

#### 注释规范
```typescript
/**
 * 服务类描述
 * 
 * @class ConfigService
 * @description 管理应用配置，包括API密钥加密存储
 */
export class ConfigService {
  /**
   * 加密文本
   * 
   * @param text - 需要加密的文本
   * @returns 加密后的文本
   */
  private encrypt(text: string): string {
    // 实现
  }
}
```

### 测试指南

#### 测试类型
1. **单元测试**: 函数、类、方法测试
2. **集成测试**: 服务间交互测试
3. **端到端测试**: 完整命令流程测试

#### 测试结构
```
src/
├── utils/
│   └── __tests__/
│       └── format.test.ts
├── services/
│   └── __tests__/
│       └── ConfigService.test.ts
└── commands/
    └── __tests__/
        └── init.test.ts
```

#### 测试编写
```typescript
import { ConfigService } from '../ConfigService';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  describe('getConfig', () => {
    it('should return default config for first run', () => {
      const config = configService.getConfig();
      expect(config.budget.monthly).toBe(200);
    });
  });
});
```

#### 测试命令
```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 覆盖率报告
npm run test:coverage

# 特定测试文件
npm test -- ConfigService
```

## 发布流程

### 版本管理
使用语义化版本 (Semantic Versioning):
- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能新增
- **修订号**: 向下兼容的问题修正

### 发布前检查清单

1. **代码质量**
   - [ ] 所有测试通过
   - [ ] 代码检查无错误
   - [ ] 覆盖率达标 (>80%)

2. **文档更新**
   - [ ] README.md更新
   - [ ] CHANGELOG.md更新
   - [ ] API文档更新

3. **版本准备**
   - [ ] package.json版本号更新
   - [ ] Git标签创建
   - [ ] 构建测试通过

### 发布步骤

```bash
# 1. 更新版本号
npm version patch|minor|major

# 2. 构建项目
npm run build

# 3. 运行最终测试
npm test

# 4. 发布到npm
npm publish

# 5. 推送标签
git push origin --tags
```

### 发布后任务
1. GitHub Release创建
2. 更新官网文档
3. 社区通知 (Twitter, Reddit等)
4. 用户反馈收集

## 调试和故障排除

### 开发调试

#### VS Code调试
使用提供的launch.json配置，设置断点进行调试。

#### 日志调试
```typescript
import debug from 'debug';

const log = debug('api-cost:config');

export class ConfigService {
  private encrypt(text: string): string {
    log('Encrypting text of length:', text.length);
    // 实现
  }
}
```

#### 环境变量
```bash
# 开发模式
export NODE_ENV=development

# 调试模式
export DEBUG=api-cost:*

# 测试环境
export NODE_ENV=test
```

### 常见问题

#### TypeScript编译错误
```bash
# 清理缓存
npm run clean

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

#### 测试失败
```bash
# 更新快照
npm test -- --updateSnapshot

# 运行特定测试
npm test -- --testNamePattern="specific test"
```

#### 权限问题
```bash
# npm权限
npm config set prefix ~/.npm-global

# 链接权限
sudo npm link
```

## 性能优化

### CLI性能
1. **延迟加载**: 按需加载模块
2. **缓存机制**: 缓存API响应
3. **并发处理**: 并行处理多个API请求

### 内存优化
1. **流式处理**: 大数据集使用流
2. **及时清理**: 避免内存泄漏
3. **对象池**: 重用对象实例

## 安全考虑

### API密钥安全
1. **加密存储**: 使用AES加密
2. **权限控制**: 限制文件访问权限
3. **环境变量**: 避免密钥泄露到日志

### 输入验证
1. **参数验证**: 严格验证用户输入
2. **SQL注入防护**: 使用参数化查询
3. **XSS防护**: 输出转义

---

## 获取帮助

- **GitHub Issues**: [报告问题](https://github.com/yourname/api-cost-guard/issues)
- **GitHub Discussions**: [开发讨论](https://github.com/yourname/api-cost-guard/discussions)
- **Email**: your.email@example.com

---

*最后更新: 2024年1月*