export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

export function formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0];
    case 'MM/dd':
      return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    case 'dd MMM':
      return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
    default:
      return d.toLocaleDateString();
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

export function getProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  let color = '\u001b[32m'; // Green
  if (percentage >= 90) {
    color = '\u001b[31m'; // Red
  } else if (percentage >= 70) {
    color = '\u001b[33m'; // Yellow
  }
  
  return `${color}${filledBar}\u001b[0m${emptyBar}`;
}

export function colorizePercentage(percentage: number, text: string): string {
  if (percentage >= 90) {
    return `\u001b[31m${text}\u001b[0m`; // Red
  } else if (percentage >= 70) {
    return `\u001b[33m${text}\u001b[0m`; // Yellow
  } else {
    return `\u001b[32m${text}\u001b[0m`; // Green
  }
}