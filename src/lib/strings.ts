export function capitalize(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function title(str: string): string {
	if (!str) return str;
	return str
		.split(' ')
		.map((word) => capitalize(word.toLocaleLowerCase()))
		.join(' ');
}
