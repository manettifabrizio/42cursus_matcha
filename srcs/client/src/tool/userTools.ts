import { store } from '@/core/store';
import { userApi } from '@/feature/user/api.slice';
import { setUser } from '@/feature/user/store.slice';
import { UserFilters, initFilters } from '@/feature/user/types';

export async function setCurrentUser() {
	try {
		const req = store.dispatch(userApi.endpoints.getProfile.initiate());
		const res = await req.unwrap();

		store.dispatch(setUser(res));
	} catch (e) {
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

export function getSearchStr(filters: UserFilters) {
	const defined_filters = Object.keys(filters)
		.filter(
			(value) =>
				filters[value as keyof typeof filters] !==
				initFilters[value as keyof typeof initFilters],
		)
		.map((key) => `${key}=${filters[key as keyof typeof filters]}`)
		.join('&');

	return '?' + JSON.stringify(defined_filters).replace(/['"]+/g, '');
}
