import { cva, type VariantProps } from 'class-variance-authority';

export type ButtonVariants = VariantProps<typeof buttonStyles>;

export const buttonStyles = cva(
	'flex h-10 items-center justify-center gap-2 rounded-lg border-3 px-4 py-2 font-semibold ring-offset-2 transition-colors duration-300 focus:ring-2 focus:outline-none active:scale-95 active:transition-transform disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'border-emerald-600 bg-emerald-500 text-white hover:border-emerald-700 hover:bg-emerald-600 focus:ring-emerald-500 active:bg-emerald-700',
				secondary:
					'border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-300 active:bg-gray-200',
				danger:
					'border-red-600 bg-red-500 text-white hover:border-red-700 hover:bg-red-600 focus:ring-red-500 active:bg-red-700',
				ghost:
					'border-transparent bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300 active:bg-gray-200',
				outline:
					'border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-300 active:bg-gray-200'
			},
			modifier: {
				link: 'hover:underline'
			}
		},
		defaultVariants: {
			variant: 'primary'
		}
	}
);
