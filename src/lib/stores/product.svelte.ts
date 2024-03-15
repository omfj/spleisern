import { createLocalStorage } from './localStorage.svelte';

export type Store = {
	products: Array<Product>;
	members: Array<string>;
};

export type Product = {
	name: string;
	price: number;
	members: Array<string>;
};

const initialValue: Store = {
	products: [],
	members: [],
};

const localStore = createLocalStorage('productStore', initialValue);

export const createProductStore = () => {
	// eslint-disable-next-line prefer-const
	let store = $state<Store>(localStore?.get() ?? initialValue);

	$effect(() => {
		localStore?.set(store);
	});

	const calculateMemberTotals = () => {
		const totals = new Map<string, number>();
		for (const member of store.members) {
			totals.set(member, 0);
		}

		for (const product of store.products) {
			const pricePerMember = product.price / product.members.length;
			for (const member of product.members) {
				totals.set(member, (totals.get(member) ?? 0) + pricePerMember);
			}
		}

		return totals;
	};

	const memberTotals = $derived(calculateMemberTotals());

	const addProduct = (product: Product) => {
		store.products.push(product);
	};

	const addProducts = (products: Array<Product>) => {
		for (const product of products) {
			addProduct(product);
		}
	};

	const removeProduct = (name: string) => {
		store.products = store.products.filter((product) => product.name !== name);
	};

	const removeMember = (member: string) => {
		store.members = store.members.filter((curr) => curr !== member);
	};

	const addMemberToProduct = (name: string, member: string) => {
		const product = store.products.find((product) => product.name === name);
		if (!product) return;
		if (!store.members.includes(member)) return;

		if (!product.members.includes(member)) {
			product.members.push(member);
		}
	};

	const removeMemberFromProduct = (name: string, member: string) => {
		const product = store.products.find((product) => product.name === name);
		if (!product) return;
		if (!store.members.includes(member)) return;

		product.members = product.members.filter((curr) => curr !== member);
	};

	const reset = () => {
		store.members = [];
		store.products = [];
	};

	return {
		get products() {
			return store.products;
		},
		get members() {
			return store.members;
		},
		set members(newMembers: Array<string>) {
			store.members = newMembers;
		},
		get memberTotals() {
			return memberTotals;
		},
		addProduct,
		addProducts,
		addMemberToProduct,
		removeProduct,
		removeMember,
		removeMemberFromProduct,
		reset,
	};
};
