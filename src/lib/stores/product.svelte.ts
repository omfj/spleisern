export type Product = {
	name: string;
	price: number;
	members: Array<string>;
};

export const createProductStore = () => {
	let products = $state<Array<Product>>([]);
	// eslint-disable-next-line prefer-const
	let members = $state<Array<string>>([]);

	const calculateMemberTotals = () => {
		const totals = new Map<string, number>();
		for (const member of members) {
			totals.set(member, 0);
		}

		for (const product of products) {
			const pricePerMember = product.price / product.members.length;
			for (const member of product.members) {
				totals.set(member, (totals.get(member) ?? 0) + pricePerMember);
			}
		}

		return totals;
	};

	const memberTotals = $derived(calculateMemberTotals());

	const addProduct = (product: Product) => {
		products.push(product);
	};

	const addProducts = (products: Array<Product>) => {
		for (const product of products) {
			addProduct(product);
		}
	};

	const removeProduct = (name: string) => {
		products = products.filter((product) => product.name !== name);
	};

	const removeMember = (member: string) => {
		members = members.filter((curr) => curr !== member);
	};

	const addMemberToProduct = (name: string, member: string) => {
		const product = products.find((product) => product.name === name);
		if (!product) return;
		if (!members.includes(member)) return;

		if (!product.members.includes(member)) {
			product.members.push(member);
		}
	};

	const removeMemberFromProduct = (name: string, member: string) => {
		const product = products.find((product) => product.name === name);
		if (!product) return;
		if (!members.includes(member)) return;

		product.members = product.members.filter((curr) => curr !== member);
	};

	return {
		get products() {
			return products;
		},
		get members() {
			return members;
		},
		set members(newMembers: Array<string>) {
			members = newMembers;
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
	};
};
