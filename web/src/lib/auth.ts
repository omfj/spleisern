import { goto } from '$app/navigation';
import ky from 'ky';

const SIGN_OUT_PATH = '/api/auth/logout';

type SignOutOptions = {
	redirect?: string;
};

export async function signOut(options: SignOutOptions = {}) {
	const redirect = options.redirect ?? '/login';

	try {
		const response = await ky.post(SIGN_OUT_PATH);

		if (response.ok) {
			goto(redirect, { replaceState: true });
		}
	} catch (error) {
		console.error('Logout failed:', error);
	}
}
