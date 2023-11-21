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
			if (value === 'smart_recommendation') return false;
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

	return (
		(filters.smart_recommendation ? '/recommandation' : '') +
		(defined_filters.length > 0 ? '?' + defined_filters : '')
	);
}

export function formatDateTime(inputDate: Date) {
	const date = new Date(inputDate);

	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	};

	return date.toLocaleString('en-GB', options);
}

export function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}
