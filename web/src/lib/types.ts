export type Spleis = {
	name: string;
	description: string;
	isPublic: boolean;
	members: Array<{ id: string; name: string }>;
	products: Array<{ id: string; name: string; price: number }>;
	assignments: Record<string, Array<string>>; // productId -> array of memberIds
};
