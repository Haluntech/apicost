import chalk from 'chalk';
import { table } from 'table';
import { ConfigService } from '@/services/ConfigService';
import { UsageService } from '@/services/UsageService';
import { formatCurrency } from '@/utils/format';
import { CommandOptions } from '@/types';

export async function suggestCommand(options: CommandOptions) {
  const configService = new ConfigService();
  const usageService = new UsageService();

  try {
    console.log(chalk.cyan('💡 Cost Optimization Suggestions\n'));

    const usage = await usageService.getCurrentUsage();
    const config = configService.getConfig();

    // Generate mock suggestions
    const suggestions = [
      {
        type: 'model-switch',
        title: 'Switch to GPT-3.5-turbo for simple tasks',
        description: 'Use GPT-3.5-turbo instead of GPT-4 for basic queries and code completion',
        savings: 45,
        effort: 'Low',
        implementation: 'Update your code to use gpt-3.5-turbo for non-complex tasks'
      },
      {
        type: 'prompt-caching',
        title: 'Enable prompt caching',
        description: 'Cache responses to repeated queries to reduce API calls',
        savings: 23,
        effort: 'Medium',
        implementation: 'Implement a simple caching layer for common queries'
      },
      {
        type: 'batch-processing',
        title: 'Batch API calls together',
        description: 'Combine multiple small requests into larger batches',
        savings: 15,
        effort: 'Low',
        implementation: 'Queue requests and process in batches of 10-20'
      },
      {
        type: 'usage-reduction',
        title: 'Add usage limits and monitoring',
        description: 'Set daily/weekly limits to prevent overuse',
        savings: 30,
        effort: 'Medium',
        implementation: 'Implement rate limiting and usage tracking in your application'
      }
    ];

    const tableData = [
      ['Suggestion', 'Potential Savings', 'Effort', 'Implementation']
    ];

    suggestions.forEach(suggestion => {
      const savings = formatCurrency(suggestion.savings, config.currency);
      const effort = suggestion.effort === 'Low' ? chalk.green(suggestion.effort) :
                     suggestion.effort === 'Medium' ? chalk.yellow(suggestion.effort) :
                     chalk.red(suggestion.effort);
      
      tableData.push([
        suggestion.title,
        chalk.bold(`${savings}/month`),
        effort,
        suggestion.implementation.substring(0, 50) + '...'
      ]);
    });

    console.log(table(tableData, {
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

    const totalSavings = suggestions.reduce((sum, s) => sum + s.savings, 0);
    console.log(chalk.bold(`\n💰 Total potential savings: ${formatCurrency(totalSavings, config.currency)}/month`));

    console.log(chalk.bold('\n🎯 Priority Actions:'));
    console.log('1. ' + chalk.green('Start with model-switch optimizations') + ' - easiest to implement');
    console.log('2. Add usage monitoring to track progress');
    console.log('3. Implement caching for repeated queries');
    console.log('4. Set up alerts to stay within budget');

    console.log(chalk.gray('\n📖 For detailed implementation guides, check our documentation'));

  } catch (error) {
    console.error(chalk.red('❌ Error generating suggestions:'), error);
    process.exit(1);
  }
}