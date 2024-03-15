import { browser } from '$app/environment';

export const createLocalStorage = <T>(key: string, initialValue: T) => {
	if (!browser) return;

	const get = () => {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}
		return initialValue;
	};

	const set = (value: T) => {
		localStorage.setItem(key, JSON.stringify(value));
	};

	return { get, set };
};
