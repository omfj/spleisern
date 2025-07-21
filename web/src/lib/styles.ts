import type { ClassValue } from 'clsx';
import { cn } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonType = 'button' | 'link';

export function buttonStyles(
	variant: ButtonVariant,
	buttonType: ButtonType,
	className?: ClassValue
) {
	return cn(
		'flex h-10 items-center justify-center gap-2 rounded-lg border-3 px-4 py-2 font-semibold ring-offset-2 transition-colors duration-200',
		'focus:ring-2 focus:outline-none',
		'active:scale-98',
		'disabled:cursor-not-allowed disabled:opacity-50',
		{
			'border-emerald-600 bg-emerald-500 text-white hover:border-emerald-700 hover:bg-emerald-600 focus:ring-emerald-500 active:bg-emerald-700':
				variant === 'primary',
			'border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-300 active:bg-gray-200':
				variant === 'secondary',
			'border-red-600 bg-red-500 text-white hover:border-red-700 hover:bg-red-600 focus:ring-red-500 active:bg-red-700':
				variant === 'danger',
			'border-transparent bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300 active:bg-gray-200':
				variant === 'ghost',
			'border-gray-300 bg-transparent text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-300 active:bg-gray-200':
				variant === 'outline'
		},
		buttonType === 'link' && 'hover:underline',
		className
	);
}
