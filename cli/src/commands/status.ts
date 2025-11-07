import chalk from 'chalk';
import { table } from 'table';
import { ConfigService } from '../services/ConfigService';
import { UsageService } from '../services/UsageService';
import { formatCurrency, formatNumber } from '../utils/format';
import { CommandOptions } from '../types';

export async function statusCommand(options: CommandOptions) {
  const configService = new ConfigService();
  const usageService = new UsageService();

  try {
    const config = configService.getConfig();
    const budget = config.budget;
    
    console.log(chalk.cyan('📊 API Cost Status'));

    // Get usage data
    const usage = await usageService.getCurrentUsage(options.provider, options.days);
    
    if (!usage || usage.totalCost === 0) {
      console.log(chalk.yellow('No usage data found.'));
      console.log(chalk.gray('Make sure your API keys are configured and you\'ve made some API calls.'));
      
      // Check if real data service was used
      const hasRealData = await checkIfRealDataAvailable();
      if (!hasRealData) {
        console.log(chalk.blue('\n💡 Note: Currently using demo data.'));
        console.log(chalk.blue('Run "api-cost test" to check your API connections.'));
      } else {
        console.log(chalk.blue('\n💡 No API usage recorded yet.'));
        console.log(chalk.blue('Make some API calls and try again.'));
      }
      return;
    }

    // Calculate metrics
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysPassed = today.getDate();
    
    const projected = (usage.totalCost / daysPassed) * daysInMonth;
    const budgetUsed = (usage.totalCost / budget.monthly) * 100;
    
    // Status overview
    const statusData = [
      ['Today', formatCurrency(usage.today, config.currency)],
      ['This Week', formatCurrency(usage.thisWeek, config.currency)],
      ['This Month', formatCurrency(usage.thisMonth, config.currency)],
      ['Projected', formatCurrency(projected, config.currency)],
      ['Budget', `${formatCurrency(budget.monthly, config.currency)} (${budgetUsed.toFixed(1)}%)`]
    ];

    console.log(chalk.bold('Overview:'));
    console.log(table(statusData, {
      border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼'
      },
      columns: {
        0: { width: 12, alignment: 'left' },
        1: { width: 15, alignment: 'right' }
      }
    }));

    // Budget status with color coding
    console.log(chalk.bold('\nBudget Status:'));
    if (budgetUsed >= 100) {
      console.log(chalk.red(`🚨 Over budget by ${formatCurrency(usage.totalCost - budget.monthly, config.currency)}`));
    } else if (budgetUsed >= budget.alertThreshold * 100) {
      console.log(chalk.yellow(`⚠️  ${budgetUsed.toFixed(1)}% of budget used (${formatCurrency(budget.monthly - usage.totalCost, config.currency)} remaining)`));
    } else {
      console.log(chalk.green(`✅ On track - ${budgetUsed.toFixed(1)}% of budget used`));
    }

    // Top models
    if (usage.topModels && usage.topModels.length > 0) {
      console.log(chalk.bold('\nTop Models:'));
      
      const modelData = [
        ['Model', 'Usage', 'Cost', '%']
      ];
      
      usage.topModels.forEach(model => {
        modelData.push([
          model.model,
          formatNumber(model.usage),
          formatCurrency(model.cost, config.currency),
          `${model.percentage.toFixed(1)}%`
        ]);
      });

      console.log(table(modelData, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        }
      }));
    }

    // Daily trend (last 7 days)
    if (usage.dailyTrend && usage.dailyTrend.length > 0) {
      console.log(chalk.bold('\n7-Day Trend:'));
      
      const trendData = [['Date', 'Cost', 'Tokens']];
      usage.dailyTrend.slice(-7).forEach(day => {
        trendData.push([
          day.date,
          formatCurrency(day.cost, config.currency),
          formatNumber(day.tokens)
        ]);
      });

      console.log(table(trendData, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        }
      }));
    }

    // Alerts and suggestions
    console.log(chalk.bold('\n💡 Quick Tips:'));
    
    if (budgetUsed > 80) {
      console.log(chalk.yellow(`• Consider setting lower usage limits - you're at ${budgetUsed.toFixed(1)}% of your budget`));
    }
    
    if (usage.topModels && usage.topModels.length > 0) {
      const mostExpensive = usage.topModels[0];
      if (mostExpensive.model.includes('gpt-4') || mostExpensive.model.includes('claude-3-opus')) {
        console.log(chalk.blue(`• Consider using ${mostExpensive.model.includes('gpt-4') ? 'GPT-3.5-turbo' : 'Claude-3-haiku'} for simple tasks`));
      }
    }
    
    console.log(chalk.gray(`• Run 'api-cost suggest' for detailed optimization recommendations`));
    
    if (budget.alerts) {
      console.log(chalk.gray(`• Alerts are ${chalk.green('enabled')} - you'll be notified at ${budget.alertThreshold * 100}% budget usage`));
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(chalk.red('❌ Error fetching usage data:'), errorMessage);
    
    if (errorMessage.includes('API key')) {
      console.log(chalk.yellow('\n💡 Tip: Make sure your API keys are correctly configured with "api-cost init"'));
    } else if (errorMessage.includes('network')) {
      console.log(chalk.yellow('\n💡 Tip: Check your internet connection and try again'));
    }
    
    process.exit(1);
  }
}

async function checkIfRealDataAvailable(): Promise<boolean> {
  try {
    const { RealUsageService } = await import('../services/RealUsageService');
    const realService = new RealUsageService();
    const connectivity = await realService.testConnectivity();
    return Object.values(connectivity).some(result => result.connected);
  } catch {
    return false;
  }
}