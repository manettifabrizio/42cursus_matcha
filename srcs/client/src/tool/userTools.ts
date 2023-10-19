import { store } from '@/core/store';
import { userApi } from '@/feature/user/api.slice';
import { setUser } from '@/feature/user/store.slice';

export async function setCurrentUser() {
	try {
		const req = store.dispatch(userApi.endpoints.getProfile.initiate());
		const res = await req.unwrap();

		store.dispatch(setUser(res));
	} catch (e) {
        console.log('pathname', location.pathname);
		if (location.pathname !== '/user/complete-profile')
			console.error(`Failed to get current user: ${JSON.stringify(e)}`);
	}
}

export function isProfileCompleted(): boolean {
	const userState = store.getState().user;

	return (
		Object.values(userState).filter((value) => value === null).length === 0
	);
}
