/**
 * Format a number as Philippine Peso with comma and space separators
 * Example: 1234567.89 => "₱1, 234, 567.89"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
    if (amount === null || amount === undefined) {
        return '₱0.00';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return '₱0.00';
    }

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = num.toFixed(2).split('.');
    
    // Add comma and space every 3 digits from the right
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
    
    return `₱${formattedInteger}.${decimalPart}`;
}

/**
 * Format a number without currency symbol
 * Example: 1234567.89 => "1, 234, 567.89"
 */
export function formatNumber(amount: number | string | null | undefined, decimals: number = 2): string {
    if (amount === null || amount === undefined) {
        return '0.00';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return '0.00';
    }

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = num.toFixed(decimals).split('.');
    
    // Add comma and space every 3 digits from the right
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
    
    return decimals > 0 ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
