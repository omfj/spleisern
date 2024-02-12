export type Product = {
	name: string;
	price: number;
	members: Array<string>;
};

export const createProductStore = () => {
	let products = $state<Array<Product>>([]);
	// eslint-disable-next-line prefer-const
	let members = $state<Array<string>>([]);

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

	const addMember = (member: string) => {
		members.push(member);
	};

	const toggleMemberToProduct = (name: string, member: string) => {
		const product = products.find((product) => product.name === name);
		if (!product) return;

		if (!members.includes(member)) {
			addMember(member);
		}

		const memberIsOnProduct = product.members.includes(member);

		if (memberIsOnProduct) {
			product.members = product.members.filter((curr) => curr === member);
		} else {
			product.members.push(member);
		}
	};

	const totalForMember = (member: string): number => {
		const memberProducts = products.filter((product) => product.members.includes(member));

		let total = 0;

		for (const product of memberProducts) {
			total = total + product.price / product.members.length;
		}

		return total;
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
		addProduct,
		addProducts,
		removeProduct,
		toggleMemberToProduct,
		totalForMember,
	};
};
