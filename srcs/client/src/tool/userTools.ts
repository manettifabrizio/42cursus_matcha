import { store } from '@/core/store';
import { setUserId } from '@/feature/interactions/store.slice';
import { userApi } from '@/feature/user/api.slice';
import {
	CompleteProfile,
	Profile,
	UserFilters,
	initFilters,
} from '@/feature/user/types';

export async function setCurrentUser() {
	try {
		const req = store.dispatch(userApi.endpoints.getProfile.initiate());
		const res = await req.unwrap();

		store.dispatch(setUserId(res.id));
	} catch (e) {;}
}

export function isProfileCompleted(profile: Profile): number | undefined {
	if (
		profile.birthdate == undefined ||
		profile.biography == undefined ||
		profile.gender == undefined ||
		profile.orientation == undefined ||
		profile.tags.length === 0
	)
		return 1;

	if (profile.pictures.length < 2 || profile.picture == null) return 2;

	return undefined;
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

export function isDateValid(
	day_str: string,
	month_str: string,
	year_str: string,
) {
	const year = Number(year_str);
	const month = Number(month_str);
	const day = Number(day_str);
	const inputDate = new Date(year, month - 1, day); // Month is zero-based, so subtract 1

	return (
		inputDate.getFullYear() === year &&
		inputDate.getMonth() === month - 1 &&
		inputDate.getDate() === day
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

export function formatDateTimeShort(inputDate: string | undefined) {
	if (!inputDate) return undefined;

	const date = new Date(inputDate);

	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

export function profileToCompleteProfile(profile: Profile): CompleteProfile {
	return {
		firstname: profile.firstname,
		lastname: profile.lastname,
		birthdate: profile.birthdate,
		gender: profile.gender,
		orientation: profile.orientation,
		biography: profile.biography,
		location: profile.location,
		tags: profile.tags.map((tag) => tag.name),
	};
}

export function getDistance(user: Profile) {
	if (user.location?.distance) return Math.floor(user.location.distance);
	else return 1;
}
