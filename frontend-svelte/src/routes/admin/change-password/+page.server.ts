import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	changePassword: async ({ request, cookies }) => {
		try {
			const token = cookies.get('token');
			const userCookie = cookies.get('user');

			if (!token || !userCookie) {
				return fail(401, { message: 'Unauthorized' });
			}

			const userSession = JSON.parse(userCookie);
			const formData = await request.formData();
			const currentPassword = formData.get('currentPassword');
			const password = formData.get('password');
			const confirmPassword = formData.get('confirmPassword');

			// Validasi input di server
			if (!currentPassword || currentPassword.toString().trim() === '') {
				return fail(400, {
					success: false,
					message: 'Password sekarang wajib diisi',
					errors: { currentPassword: 'Password sekarang wajib diisi' }
				});
			}

			if (!password || password.toString().trim() === '') {
				return fail(400, {
					success: false,
					message: 'Password baru wajib diisi',
					errors: { password: 'Password baru wajib diisi' }
				});
			}

			if (password !== confirmPassword) {
				return fail(400, {
					success: false,
					message: 'Konfirmasi password tidak cocok',
					errors: { confirmPassword: 'Konfirmasi password tidak cocok' }
				});
			}

			// Mengirim request PUT dengan password baru dan current password
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userSession.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${token}`
				},
				body: JSON.stringify({
					password,
					currentPassword
				})
			});

			const result = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					success: false,
					message: result.message || 'Gagal mengubah password',
					errors: result.errors || {}
				});
			}

			return { success: true };
		} catch (error) {
			console.error('Error changing password:', error);
			return fail(500, {
				success: false,
				message: 'Internal Server Error'
			});
		}
	}
};
