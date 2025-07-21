import { format, isToday, isYesterday, isThisYear } from 'date-fns';

/**
 * Format a date for display in a user-friendly way
 * @param date - The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
	if (isToday(date)) {
		return `Today at ${format(date, 'HH:mm')}`;
	}

	if (isYesterday(date)) {
		return `Yesterday at ${format(date, 'HH:mm')}`;
	}

	if (isThisYear(date)) {
		return format(date, 'MMM d');
	}

	return format(date, 'MMM d, yyyy');
}

/**
 * Format a date as a full date string
 * @param date - The date to format
 * @returns A formatted date string like "January 15, 2024"
 */
export function formatFullDate(date: Date): string {
	return format(date, 'MMMM d, yyyy');
}

/**
 * Format a date with time
 * @param date - The date to format
 * @returns A formatted date string with time like "Jan 15, 2024 at 10:30 AM"
 */
export function formatDateTime(date: Date): string {
	return format(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Format a date relative to now
 * @param date - The date to format
 * @returns A relative date string like "2 days ago"
 */
export function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) {
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		if (diffInHours === 0) {
			const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
			return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
		}
		return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
	}

	if (diffInDays === 1) {
		return 'Yesterday';
	}

	if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	}

	if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
	}

	if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return months === 1 ? '1 month ago' : `${months} months ago`;
	}

	const years = Math.floor(diffInDays / 365);
	return years === 1 ? '1 year ago' : `${years} years ago`;
}
