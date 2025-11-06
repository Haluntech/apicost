import chalk from 'chalk';
import { table } from 'table';
import { ConfigService } from '../services/ConfigService';
import { UsageService } from '../services/UsageService';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';
import { CommandOptions } from '../types';

export async function historyCommand(options: CommandOptions) {
  const configService = new ConfigService();
  const usageService = new UsageService();

  try {
    console.log(chalk.cyan('📅 Usage History\n'));

    const days = parseInt(options.days?.toString() || '30');
    const usage = await usageService.getCurrentUsage();
    const config = configService.getConfig();

    if (!usage.dailyTrend || usage.dailyTrend.length === 0) {
      console.log(chalk.yellow('No historical data available.'));
      return;
    }

    // Show recent history
    const recentData = usage.dailyTrend.slice(-days);
    
    if (options.format === 'json') {
      console.log(JSON.stringify(recentData, null, 2));
      return;
    }

    const tableData = [
      ['Date', 'Cost', 'Tokens', 'Requests']
    ];

    recentData.forEach(day => {
      tableData.push([
        formatDate(day.date),
        formatCurrency(day.cost, config.currency),
        formatNumber(day.tokens),
        day.requests.toString()
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

    // Summary statistics
    const totalCost = recentData.reduce((sum, day) => sum + day.cost, 0);
    const totalTokens = recentData.reduce((sum, day) => sum + day.tokens, 0);
    const totalRequests = recentData.reduce((sum, day) => sum + day.requests, 0);
    const avgDaily = totalCost / recentData.length;

    console.log(chalk.bold('\n📊 Summary Statistics:'));
    console.log(`• Total cost: ${formatCurrency(totalCost, config.currency)}`);
    console.log(`• Average daily: ${formatCurrency(avgDaily, config.currency)}`);
    console.log(`• Total tokens: ${formatNumber(totalTokens)}`);
    console.log(`• Total requests: ${totalRequests.toLocaleString()}`);
    console.log(`• Period: ${days} days`);

  } catch (error) {
    console.error(chalk.red('❌ Error fetching history:'), error);
    process.exit(1);
  }
}