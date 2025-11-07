# API Cost Guard - Visualization Options

This document outlines all available visualization options for monitoring API costs while coding.

## 1. CLI Terminal Monitoring 🖥️

### Real-time Monitoring Command
```bash
api-cost monitor
```
Features:
- Continuous cost monitoring with customizable intervals (default: 5 minutes)
- Real-time alerts when budget thresholds are reached
- Progress bars showing budget usage
- Color-coded alerts (green/yellow/red)
- Auto-stop functionality with duration option

### Usage Examples
```bash
# Start monitoring with 5-minute intervals
api-cost monitor

# Monitor every 10 minutes for 1 hour
api-cost monitor -i 10 -d 60

# Quick monitoring every 2 minutes
api-cost monitor -i 2
```

## 2. VS Code Extension 💻

### Status Bar Integration
- Real-time cost display in VS Code status bar
- Color-coded based on budget usage:
  - 🔴 Red: ≥90% budget used
  - 🟡 Yellow: ≥70% budget used  
  - 🟢 Green: Normal usage
- Clickable status for detailed breakdown
- Auto-updates every 2 minutes

### Commands
- `API Cost Guard: Show API Cost Status` - Open terminal with detailed status
- `API Cost Guard: Start Monitoring` - Start real-time monitoring in terminal
- `API Cost Guard: Stop Monitoring` - Stop active monitoring
- `API Cost Guard: Settings` - Open configuration file

### Package.json Detection
- Automatically detects AI package installations
- Updates status when new dependencies are added

## 3. CLI Quick Status Commands 📊

### Status Overview
```bash
api-cost status
```
- Shows current month's usage
- Displays budget percentage
- Provider-specific breakdowns
- Projected monthly costs

### Budget Management
```bash
# Set budget
api-cost budget set 200

# Show budget status
api-cost budget show

# Set alert threshold
api-cost budget threshold 80
```

### Predictions & Forecasts
```bash
# Predict monthly costs
api-cost predict

# Get optimization suggestions
api-cost suggest
```

## 4. Alerting System 🚨

### Built-in Alert Types
- **Info Alerts**: Milestone notifications (50% budget used)
- **Warning Alerts**: 80%+ budget usage or projected overages
- **Danger Alerts**: 100%+ budget exceeded

### Alert Channels
- Terminal notifications during monitoring
- VS Code status bar color changes
- Configurable alert thresholds

## 5. Historical Analysis 📈

### Usage History
```bash
# Show 30-day history
api-cost history

# Show 7-day history in JSON format
api-cost history -d 7 --format json

# Export to CSV
api-cost history --format csv -o usage.csv
```

### Cost Reports
```bash
# Generate monthly report
api-cost report -f markdown -o report.md

# Weekly report
api-cost report -p week -f json
```

## 6. Installation & Setup 🛠️

### CLI Tool Installation
```bash
npm install -g api-cost-guard
api-cost init
```

### VS Code Extension Installation
1. Install from VS Code Marketplace (once published)
2. Or install from .vsix file:
```bash
code --install-extension api-cost-guard-*.vsix
```

### Configuration
- API keys stored in encrypted local config
- Supports OpenAI, Claude, and Google AI
- Budget and alert customization
- Provider-specific model tracking

## 7. Integration Workflow 🔄

### Recommended Setup for Developers
1. Install CLI tool globally
2. Configure API keys with `api-cost init`
3. Set monthly budget with `api-cost budget set <amount>`
4. Install VS Code extension for IDE integration
5. Start monitoring with `api-cost monitor` when coding
6. Check status bar in VS Code for quick updates
7. Review weekly reports with `api-cost report -p week`

### Best Practices
- Start monitoring at the beginning of coding sessions
- Set appropriate budget thresholds (70% warning, 90% critical)
- Review optimization suggestions regularly
- Export monthly reports for expense tracking
- Keep VS Code extension updated for latest features

## 8. File Locations 📁

### Configuration Files
- **CLI Config**: `~/.api-cost/config.json` (encrypted)
- **Logs**: `~/.api-cost/logs/`
- **Reports**: Current directory or specified path

### Extension Data
- **VS Code Extension**: Installed in VS Code extensions directory
- **Terminal Sessions**: Managed by VS Code terminal API
- **Status Cache**: In-memory, updates every 2 minutes

## 9. Troubleshooting 🔧

### Common Issues
- **API Key Errors**: Run `api-cost test` to verify connections
- **Missing Tool**: Ensure `api-cost` is in PATH or npm global bin
- **Extension Not Working**: Check VS Code developer console for errors
- **No Data**: First-time setup may take a few minutes to populate

### Debug Commands
```bash
# Test API connections
api-cost test

# Check configuration
api-cost status --verbose

# Reset configuration
api-cost init --force
```

This comprehensive monitoring solution ensures developers can track their AI API costs in real-time while maintaining focus on their coding workflow.