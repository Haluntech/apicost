import chalk from 'chalk';
import { table } from 'table';
import { ConfigService } from '../services/ConfigService';

export async function testCommand(options: { provider?: string }) {
  const configService = new ConfigService();
  const config = configService.getConfig();

  console.log(chalk.cyan('🔌 Testing API Key Connections\n'));

  if (Object.keys(config.apis).length === 0) {
    console.log(chalk.yellow('No API providers configured.'));
    console.log(chalk.gray('Run "api-cost init" to configure API providers.'));
    return;
  }

  try {
    const { RealUsageService } = await import('../services/RealUsageService');
    const realService = new RealUsageService();

    const providersToTest = options.provider 
      ? options.provider in config.apis ? [options.provider] : []
      : Object.keys(config.apis);

    if (providersToTest.length === 0) {
      console.log(chalk.red(`Provider "${options.provider}" not found in configuration.`));
      console.log(chalk.gray('Available providers:', Object.keys(config.apis).join(', ')));
      return;
    }

    console.log(chalk.blue('Testing connections...'));
    console.log('');

    const results = await realService.testConnectivity();
    
    const tableData = [
      ['Provider', 'Status', 'Details']
    ];

    let allConnected = true;

    for (const provider of providersToTest) {
      const result = results[provider];
      const status = result.connected 
        ? chalk.green('✅ Connected') 
        : chalk.red('❌ Failed');
      const details = result.error || chalk.green('API key is valid');
      
      tableData.push([
        provider,
        status,
        details
      ]);

      if (!result.connected) {
        allConnected = false;
      }
    }

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

    console.log('');

    if (allConnected) {
      console.log(chalk.green('🎉 All API connections are working!'));
      console.log(chalk.gray('You can now run "api-cost status" to see your real usage data.'));
    } else {
      console.log(chalk.yellow('⚠️  Some connections failed. Please check your API keys:'));
      console.log(chalk.gray('1. Make sure the API keys are correct'));
      console.log(chalk.gray('2. Check if the keys have the necessary permissions'));
      console.log(chalk.gray('3. Verify your internet connection'));
      console.log(chalk.gray('4. Run "api-cost init --force" to reconfigure'));
    }

  } catch (error) {
    console.error(chalk.red('❌ Error testing connections:'), error);
    console.log(chalk.yellow('\n💡 Make sure you have the necessary permissions and network access.'));
  }
}