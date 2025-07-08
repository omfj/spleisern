/**
 * Generate a random account number.
 *
 * @returns A random account number in the format of 16 digits.
 */
export function generateAccountNumber(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	return Array.from(bytes)
		.map((b) => b.toString().padStart(3, '0'))
		.join('')
		.slice(0, 16);
}

/**
 * Format the account number in the following format:
 *
 * ACC-1234-5678-9101-1121
 *
 * @param accountNumber - The account number to format.
 */
export function formatAccountNumber(accountNumber: string): string {
	const prefix = 'ACC-';
	const formatted = accountNumber.replace(/(\d{4})(?=\d)/g, '$1-');
	return prefix + formatted;
}

export function numbersFromString(str: string): string {
	return str.replace(/[^0-9]/g, '');
}

/**
 * Reverses the formatting of an account number.
 *
 * @param formattedAccountNumber - The formatted account number to reverse.
 */
export function reverseFormatAccountNumber(formattedAccountNumber: string): string {
	const cleaned = numbersFromString(formattedAccountNumber);
	if (cleaned.length !== 16) {
		throw new Error('Invalid formatted account number length');
	}
	return cleaned;
}
