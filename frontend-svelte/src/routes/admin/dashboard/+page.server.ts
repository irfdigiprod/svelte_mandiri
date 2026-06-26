export async function load({ cookies }) {
	// Ambil cookie 'user'
	const userData = cookies.get('user');

	// Kembalikan user data sebagai props
	return {
		user: userData ? JSON.parse(userData) : null
	};
}
