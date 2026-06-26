import { fail } from '@sveltejs/kit';

export async function load({ fetch, cookies }) {
	const userCookie = cookies.get('user');
	const token = cookies.get('token');

	if (!userCookie || !token) {
		return { user: null };
	}

	const userSession = JSON.parse(userCookie);

	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userSession.id}`, {
			headers: {
				Authorization: `${token}`,
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();
		return {
			user: result.data || userSession
		};
	} catch (e) {
		console.error('Error loading user profile:', e);
		return { user: userSession };
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	updateProfile: async ({ request, cookies }) => {
		try {
			const token = cookies.get('token');
			const userCookie = cookies.get('user');

			if (!token || !userCookie) {
				return fail(401, { message: 'Unauthorized' });
			}

			const userSession = JSON.parse(userCookie);
			const formData = await request.formData();
			const name = formData.get('name');
			const username = formData.get('username');
			const email = formData.get('email');

			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userSession.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${token}`
				},
				body: JSON.stringify({
					name,
					username,
					email
				})
			});

			const result = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					success: false,
					message: result.message || 'Gagal memperbarui profil',
					errors: result.errors || {},
					values: { name, username, email }
				});
			}

			// Update cookie data user
			cookies.set('user', JSON.stringify(result.data), {
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60
			});

			return { success: true, user: result.data };
		} catch (error) {
			console.error('Error updating profile:', error);
			return fail(500, {
				success: false,
				message: 'Internal Server Error'
			});
		}
	}
};
