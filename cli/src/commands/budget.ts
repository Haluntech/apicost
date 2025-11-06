import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';
import { formatCurrency } from '../utils/format';

export async function budgetCommand(action: string, value?: string) {
  const configService = new ConfigService();

  try {
    const config = configService.getConfig();
    const budget = config.budget;

    switch (action) {
      case 'set':
        if (!value) {
          console.error(chalk.red('❌ Budget amount is required'));
          console.log(chalk.gray('Usage: api-cost budget set <amount>'));
          return;
        }
        
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
          console.error(chalk.red('❌ Invalid budget amount'));
          return;
        }

        configService.updateBudget({ monthly: amount });
        console.log(chalk.green(`✅ Monthly budget set to ${formatCurrency(amount, config.currency)}`));
        break;

      case 'show':
        console.log(chalk.cyan('💰 Budget Settings\n'));
        console.log(`• Monthly budget: ${formatCurrency(budget.monthly, config.currency)}`);
        console.log(`• Alert threshold: ${(budget.alertThreshold * 100).toFixed(0)}%`);
        console.log(`• Alerts: ${budget.alerts ? chalk.green('Enabled') : chalk.red('Disabled')}`);
        
        // Calculate days remaining and daily budget
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysRemaining = daysInMonth - now.getDate();
        const dailyBudget = budget.monthly / daysInMonth;
        
        console.log(`• Daily budget: ${formatCurrency(dailyBudget, config.currency)}`);
        console.log(`• Days remaining: ${daysRemaining}`);
        break;

      case 'threshold':
        if (!value) {
          console.error(chalk.red('❌ Threshold percentage is required'));
          console.log(chalk.gray('Usage: api-cost budget threshold <percentage>'));
          return;
        }

        const threshold = parseFloat(value) / 100;
        if (isNaN(threshold) || threshold <= 0 || threshold > 1) {
          console.error(chalk.red('❌ Threshold must be between 0 and 100'));
          return;
        }

        configService.updateBudget({ alertThreshold: threshold });
        console.log(chalk.green(`✅ Alert threshold set to ${(threshold * 100).toFixed(0)}%`));
        break;

      default:
        console.error(chalk.red('❌ Unknown budget command'));
        console.log(chalk.gray('Available commands: set, show, threshold'));
    }

  } catch (error) {
    console.error(chalk.red('❌ Error managing budget:'), error);
    process.exit(1);
  }
}