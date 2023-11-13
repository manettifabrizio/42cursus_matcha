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
		.filter((value) => {
			let other_value = null;
			if (value.includes('_min'))
				other_value = value.replace('_min', '_max');
			else if (value.includes('_max'))
				other_value = value.replace('_max', '_min');
			return (
				filters[value as keyof typeof filters] !==
					initFilters[value as keyof typeof initFilters] ||
				(other_value &&
					filters[other_value as keyof typeof filters] !==
						initFilters[other_value as keyof typeof initFilters])
			);
		})
		.map((key) => `${key}=${filters[key as keyof typeof filters]}`)
		.join('&');

	return defined_filters.length > 0 ? '?' + defined_filters : '';
}
