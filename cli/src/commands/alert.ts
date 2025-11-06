import chalk from 'chalk';
import { ConfigService } from '@/services/ConfigService';

export async function alertCommand(action: string) {
  const configService = new ConfigService();

  try {
    const config = configService.getConfig();
    const budget = config.budget;

    switch (action) {
      case 'on':
        configService.updateBudget({ alerts: true });
        console.log(chalk.green('✅ Alerts enabled'));
        console.log(chalk.gray(`You'll be notified at ${(budget.alertThreshold * 100).toFixed(0)}% budget usage`));
        break;

      case 'off':
        configService.updateBudget({ alerts: false });
        console.log(chalk.yellow('⚠️  Alerts disabled'));
        console.log(chalk.gray('You won\'t receive budget notifications'));
        break;

      case 'status':
        console.log(chalk.cyan('🔔 Alert Status\n'));
        console.log(`• Alerts: ${budget.alerts ? chalk.green('Enabled') : chalk.red('Disabled')}`);
        console.log(`• Threshold: ${(budget.alertThreshold * 100).toFixed(0)}% of budget`);
        console.log(`• Notification method: Terminal output`);
        
        if (budget.alerts) {
          console.log(chalk.green('\n✅ Alerts are active'));
        } else {
          console.log(chalk.yellow('\n⚠️  Alerts are disabled'));
          console.log(chalk.gray('Enable with: api-cost alert on'));
        }
        break;

      default:
        console.error(chalk.red('❌ Unknown alert command'));
        console.log(chalk.gray('Available commands: on, off, status'));
    }

  } catch (error) {
    console.error(chalk.red('❌ Error managing alerts:'), error);
    process.exit(1);
  }
}