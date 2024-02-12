export const preventDefault = (fn: (e: Event) => void) => (e: Event) => {
	e.preventDefault();
	fn(e);
};
