import Conf from 'conf';
import CryptoJS from 'crypto-js';
import { Config, APIProvider, Budget } from '@/types';

export class ConfigService {
  private config: Conf;
  private encryptionKey: string;

  constructor() {
    this.config = new Conf({
      projectName: 'api-cost-guard',
      projectVersion: '1.0.0',
      cwd: process.env.HOME || process.env.USERPROFILE || '.'
    });
    
    // Generate or retrieve encryption key
    this.encryptionKey = this.getEncryptionKey();
  }

  private getEncryptionKey(): string {
    const storedKey = this.config.get('encryptionKey') as string;
    if (storedKey) {
      return storedKey;
    }
    
    // Generate new encryption key
    const key = CryptoJS.lib.WordArray.random(256/8).toString();
    this.config.set('encryptionKey', key);
    return key;
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  getConfig(): Config {
    const defaultConfig: Config = {
      apis: {},
      budget: {
        monthly: 200,
        alertThreshold: 0.8,
        alerts: true
      },
      currency: 'USD',
      dateFormat: 'yyyy-MM-dd'
    };

    const storedConfig = this.config.get('config') as Config;
    return { ...defaultConfig, ...storedConfig };
  }

  updateConfig(updates: Partial<Config>): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, ...updates };
    this.config.set('config', newConfig);
  }

  addAPIProvider(provider: APIProvider): void {
    const config = this.getConfig();
    
    // Encrypt API key
    const encryptedProvider = {
      ...provider,
      apiKey: this.encrypt(provider.apiKey)
    };
    
    config.apis[provider.name] = encryptedProvider;
    this.config.set('config', config);
  }

  getAPIProvider(name: string): APIProvider | null {
    const config = this.getConfig();
    const provider = config.apis[name];
    
    if (!provider) {
      return null;
    }
    
    // Decrypt API key
    return {
      ...provider,
      apiKey: this.decrypt(provider.apiKey)
    };
  }

  getAllAPIProviders(): APIProvider[] {
    const config = this.getConfig();
    return Object.values(config.apis).map(provider => ({
      ...provider,
      apiKey: this.decrypt(provider.apiKey)
    }));
  }

  removeAPIProvider(name: string): void {
    const config = this.getConfig();
    delete config.apis[name];
    this.config.set('config', config);
  }

  updateBudget(budget: Partial<Budget>): void {
    const config = this.getConfig();
    config.budget = { ...config.budget, ...budget };
    this.config.set('config', config);
  }

  getBudget(): Budget {
    return this.getConfig().budget;
  }

  validateAPIKey(provider: string, apiKey: string): boolean {
    // Basic validation for different providers
    switch (provider) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'claude':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      case 'google':
        return apiKey.length > 20; // Google AI has various key formats
      default:
        return apiKey.length > 10;
    }
  }

  isFirstRun(): boolean {
    return !this.config.has('config');
  }

  reset(): void {
    this.config.clear();
  }

  exportConfig(): string {
    const config = this.getConfig();
    // Remove sensitive data for export
    const exportData = {
      ...config,
      apis: Object.keys(config.apis).reduce((acc, key) => {
        acc[key] = {
          ...config.apis[key],
          apiKey: '***REDACTED***'
        };
        return acc;
      }, {} as Record<string, any>)
    };
    return JSON.stringify(exportData, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      // Validate basic structure
      if (importedConfig.apis && typeof importedConfig.apis === 'object') {
        // Remove any redacted keys
        Object.keys(importedConfig.apis).forEach(key => {
          if (importedConfig.apis[key].apiKey === '***REDACTED***') {
            delete importedConfig.apis[key];
          }
        });
      }
      this.config.set('config', importedConfig);
    } catch (error) {
      throw new Error('Invalid config file format');
    }
  }
}