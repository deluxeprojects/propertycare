export function formatCurrency(amount: number, currency = 'AED'): string {
  return `${currency} ${amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: Date | string, locale = 'en-GB'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string, locale = 'en-GB'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('971')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

export function formatOrderNumber(sequence: number, prefix = 'LH'): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(5, '0')}`;
}

export function formatInvoiceNumber(sequence: number, prefix = 'INV'): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(5, '0')}`;
}
