# 🦾 API Cost Guard

<div align="center">

[![npm version](https://badge.fury.io/js/api-cost-guard.svg)](https://badge.fury.io/js/api-cost-guard)
[![VS Code Marketplace](https://vsmarketplacebadges.vercel.app/version/haluntech.api-cost-guard.svg)](https://marketplace.visualstudio.com/items?itemName=haluntech.api-cost-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescript-lang.org/)

**Real-time AI API cost monitoring and optimization for developers**

Stop surprise API bills! Monitor your OpenAI, Claude, and Google AI costs in real-time while you code.

[Install CLI](#installation) • [VS Code Extension](#vs-code-extension) • [Documentation](#documentation) • [Quick Start](#quick-start)

</div>

## ✨ Features

### 🖥️ **Terminal Monitoring**
- Real-time cost tracking with customizable intervals
- Intelligent alerts when approaching budget limits
- Color-coded progress bars and notifications
- Continuous monitoring during coding sessions

### 💻 **VS Code Integration**
- Status bar cost display with live updates
- One-click monitoring start/stop
- Budget usage indicators (🟢🟡🔴)
- Automatic detection of AI package installations

### 📊 **Comprehensive Analytics**
- Multi-provider support (OpenAI, Claude, Google AI)
- Usage history and trend analysis
- Cost predictions and forecasting
- Optimization suggestions

### 🔒 **Privacy-First**
- Local data storage with encryption
- No cloud dependencies
- Secure API key management
- Offline functionality

## 🚀 Quick Start

### Installation

```bash
# Install CLI tool globally
npm install -g api-cost-guard

# Initialize configuration
api-cost init

# Set your monthly budget
api-cost budget set 100
```

### Basic Usage

```bash
# Check current status
api-cost status

# Start real-time monitoring
api-cost monitor

# Get cost predictions
api-cost predict

# View optimization suggestions
api-cost suggest
```

## 📦 Installation

### CLI Tool

```bash
npm install -g api-cost-guard
```

### VS Code Extension

1. **From Marketplace** (recommended):
   - Search "API Cost Guard" in VS Code extensions
   - Click **Install**

2. **From .vsix file**:
   ```bash
   code --install-extension api-cost-guard-0.2.0.vsix
   ```

## 🎯 Core Use Cases

### 1. **Development Time Monitoring**
```bash
# Start monitoring when you begin coding
api-cost monitor

# Monitor every 5 minutes for 2 hours
api-cost monitor -i 5 -d 120
```

### 2. **Budget Management**
```bash
# Set monthly budget
api-cost budget set 200

# Configure alert threshold
api-cost budget threshold 80

# Check budget status
api-cost budget show
```

### 3. **Cost Analysis**
```bash
# 7-day usage history
api-cost history -d 7

# Generate monthly report
api-cost report -p month -f markdown

# Export data for analysis
api-cost history --format csv -o costs.csv
```

## 📊 Supported Providers

| Provider | Models | Features |
|----------|---------|----------|
| **OpenAI** | GPT-4, GPT-3.5, DALL-E | ✅ Usage tracking, ✅ Cost calculation |
| **Claude** | Claude-3, Claude-2 | ✅ Usage tracking, ✅ Cost calculation |
| **Google AI** | Gemini Pro, Gemini Vision | ✅ Usage tracking, ✅ Cost calculation |

## 🎨 Visualization Options

### Terminal Monitoring
<div align="center">

```bash
🔍 Starting API Cost Monitor

[14:32] 💡 Status: $12.34 / $100 (12.3%) | ██████░░░░░░░░░░░░░░░░░░░
[14:37] ⚠️ Budget Alert: 85.0% of budget used
        💰 Current: $85.00 | Budget: $100 | █████████████████░░░░░░
```

</div>

### VS Code Status Bar
- **$12.34** 🟢 Normal usage (<70% budget)
- **$85.00** 🟡 Warning (70-90% budget)  
- **$105.00** 🔴 Over budget (>90% budget)

### Progress Indicators
```
Budget Usage: ███████████████████████ 100%
```

## 📈 Commands Reference

### Core Commands
```bash
api-cost status          # Show current usage status
api-cost monitor         # Start real-time monitoring
api-cost predict         # Predict monthly costs
api-cost suggest         # Get optimization suggestions
api-cost history         # Show usage history
```

### Budget Management
```bash
api-cost budget set 200    # Set $200 monthly budget
api-cost budget show       # Show current budget
api-cost budget threshold 80  # Set 80% alert threshold
```

### Reporting
```bash
api-cost report -f markdown    # Generate markdown report
api-cost report -p week        # Weekly report
api-cost report -o report.md   # Save to file
```

### Configuration
```bash
api-cost init               # Initialize configuration
api-cost test               # Test API connections
api-cost init --force       # Reset configuration
```

## ⚙️ Configuration

### API Setup
```bash
# Interactive setup
api-cost init

# Or edit configuration directly
~/.api-cost/config.json
```

### Configuration Structure
```json
{
  "providers": {
    "openai": { "apiKey": "sk-...", "models": ["gpt-4", "gpt-3.5-turbo"] },
    "claude": { "apiKey": "sk-ant-...", "models": ["claude-3-opus"] },
    "google": { "apiKey": "AIza...", "models": ["gemini-pro"] }
  },
  "budget": { "monthly": 100, "threshold": 80 },
  "alerts": { "enabled": true }
}
```

## 🔧 Advanced Features

### Real-time Monitoring
```bash
# Custom intervals (minutes)
api-cost monitor -i 10

# Duration limits (minutes)
api-cost monitor -d 60

# Continuous monitoring
api-cost monitor
```

### Data Export
```bash
# CSV export
api-cost history --format csv -o usage.csv

# JSON export
api-cost history --format json -o usage.json

# Markdown report
api-cost report -f markdown -o report.md
```

### Alert Customization
```bash
# Configure alert thresholds
api-cost budget threshold 70  # Warning at 70%
api-cost budget threshold 90  # Critical at 90%

# Toggle alerts
api-cost alert on
api-cost alert off
```

## 🛠️ Development

### Project Structure
```
api-cost-guard/
├── cli/                    # CLI tool source code
│   ├── src/
│   │   ├── commands/      # CLI commands
│   │   ├── services/      # Core services
│   │   └── utils/         # Utilities
│   └── package.json
├── vscode-extension/       # VS Code extension
│   ├── src/
│   │   └── extension.ts   # Extension logic
│   └── package.json
└── docs/                  # Documentation
```

### Building from Source
```bash
# Clone repository
git clone https://github.com/Haluntech/apicost.git

# Install CLI dependencies
cd cli && npm install
npm run build

# Install VS Code extension dependencies
cd ../vscode-extension
npm install
npm run compile
```

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
```bash
# Test API connections
api-cost test

# Reconfigure keys
api-cost init --force
```

**Tool Not Found**
```bash
# Verify installation
which api-cost

# Reinstall globally
npm install -g api-cost-guard
```

**VS Code Extension Not Working**
1. Check VS Code developer console for errors
2. Ensure CLI tool is installed and accessible
3. Restart VS Code

**No Data Showing**
```bash
# Check configuration
api-cost status --verbose

# Verify API keys are valid
api-cost test
```

### Debug Mode
```bash
# Enable verbose output
api-cost status --verbose

# View logs
tail -f ~/.api-cost/logs/api-cost.log
```

## 📚 Documentation

- [📖 Full Documentation](./VISUALIZATION_OPTIONS.md)
- [🎨 Visualization Guide](./VISUALIZATION_OPTIONS.md)
- [🔧 Configuration Guide](./docs/configuration.md)
- [📊 API Reference](./docs/api.md)

## 🤝 Community

- 🐛 [Bug Reports](https://github.com/Haluntech/apicost/issues)
- 💡 [Feature Requests](https://github.com/Haluntech/apicost/discussions)
- 📧 [Email Support](mailto:support@apicostguard.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [VS Code API](https://code.visualstudio.com/api) - Extension development

---

<div align="center">

**Stop surprise bills. Start coding smarter.** 💰🚀

[GitHub](https://github.com/Haluntech/apicost) • [NPM](https://www.npmjs.com/package/api-cost-guard) • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=haluntech.api-cost-guard)

</div>