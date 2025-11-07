#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';
import { predictCommand } from './commands/predict';
import { suggestCommand } from './commands/suggest';
import { historyCommand } from './commands/history';
import { budgetCommand } from './commands/budget';
import { alertCommand } from './commands/alert';
import { reportCommand } from './commands/report';
import { testCommand } from './commands/test';
import { monitorCommand } from './commands/monitor';
import { ConfigService } from './services/ConfigService';

const program = new Command();

// Global configuration
program
  .name('api-cost')
  .description('AI API cost monitoring and optimization tool')
  .version('0.1.0')
  .option('-v, --verbose', 'verbose output')
  .option('-q, --quiet', 'quiet mode')
  .option('--json', 'output in JSON format')
  .hook('preAction', async (thisCommand) => {
    // Check if config exists for commands that need it
    const configService = new ConfigService();
    const commandsNeedingConfig = ['status', 'predict', 'suggest', 'history', 'budget', 'report'];
    
    if (commandsNeedingConfig.includes(thisCommand.name()) && configService.isFirstRun()) {
      console.log(chalk.yellow('⚠️  No configuration found. Please run "api-cost init" first.'));
      process.exit(1);
    }
  });

// Commands
program
  .command('init')
  .description('Initialize configuration')
  .option('-f, --force', 'overwrite existing configuration')
  .action(initCommand);

program
  .command('status')
  .description('Show current API usage status')
  .option('-p, --provider <provider>', 'filter by provider (openai, claude, google)')
  .option('-d, --days <days>', 'number of days to analyze', '7')
  .action(statusCommand);

program
  .command('predict')
  .description('Predict monthly API costs')
  .option('-c, --confidence', 'show confidence level')
  .action(predictCommand);

program
  .command('suggest')
  .description('Get cost optimization suggestions')
  .option('-t, --type <type>', 'filter by suggestion type')
  .action(suggestCommand);

program
  .command('history')
  .description('Show usage history')
  .option('-d, --days <days>', 'number of days to show', '30')
  .option('--format <format>', 'output format (table, json, csv)', 'table')
  .action(historyCommand);

program
  .command('budget')
  .description('Manage budget settings')
  .addCommand(
    new Command('set')
      .description('Set monthly budget')
      .argument('<amount>', 'budget amount')
      .action((amount) => budgetCommand('set', amount))
  )
  .addCommand(
    new Command('show')
      .description('Show current budget')
      .action(() => budgetCommand('show'))
  )
  .addCommand(
    new Command('threshold')
      .description('Set alert threshold')
      .argument('<percentage>', 'alert threshold percentage (0-100)')
      .action((percentage) => budgetCommand('threshold', percentage))
  );

program
  .command('alert')
  .description('Manage alerts')
  .addCommand(
    new Command('on')
      .description('Enable alerts')
      .action(() => alertCommand('on'))
  )
  .addCommand(
    new Command('off')
      .description('Disable alerts')
      .action(() => alertCommand('off'))
  )
  .addCommand(
    new Command('status')
      .description('Show alert status')
      .action(() => alertCommand('status'))
  );

program
  .command('report')
  .description('Generate cost report')
  .option('-f, --format <format>', 'report format (json, markdown, csv)', 'json')
  .option('-o, --output <file>', 'output file path')
  .option('-p, --period <period>', 'report period (day, week, month)', 'month')
  .action(reportCommand);

program
  .command('test')
  .description('Test API key connections')
  .option('-p, --provider <provider>', 'test specific provider only')
  .action(testCommand);

program
  .command('monitor')
  .description('Start real-time cost monitoring')
  .option('-i, --interval <minutes>', 'monitoring interval in minutes (default: 5)')
  .option('-d, --duration <minutes>', 'monitor for specific duration (optional)')
  .action(monitorCommand);

// Global error handler
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Unexpected error:'), error.message);
  if (program.opts().verbose) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled promise rejection:'), reason);
  if (program.opts().verbose) {
    console.error(promise);
  }
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan('🦾 API Cost Guard - AI API Cost Monitoring Tool\n'));
  program.outputHelp();
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.gray('  api-cost init              # Initialize configuration'));
  console.log(chalk.gray('  api-cost status            # Show current status'));
  console.log(chalk.gray('  api-cost predict           # Predict monthly costs'));
  console.log(chalk.gray('  api-cost suggest           # Get optimization suggestions'));
  console.log(chalk.gray('  api-cost budget set 200    # Set $200 monthly budget'));
  console.log(chalk.gray('\n📖 Documentation: https://github.com/yourname/api-cost-guard'));
}