export async function load({ cookies }) {
	const userData = cookies.get('user');
	return {
		user: userData ? JSON.parse(userData) : null
	};
}
