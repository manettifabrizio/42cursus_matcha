import toast from 'react-hot-toast';
import {
	AuthProfile,
	AuthProfileError,
	CompleteProfile,
	CompleteProfileError,
	Tag,
	TagsError,
} from './types';
import { getGeolocation } from '@/tool/getLocation';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import { userApi } from './api.slice';
import { store } from '@/core/store';
import { authApi } from '../auth/api.slice';

export function checkBeforeSubmitting(
	profile: CompleteProfile,
	toast_id: string,
): boolean {
	if (profile.birthdate === undefined) {
		toast.error('Birthdate is required.', { id: toast_id });
		return false;
	}

	if (profile.tags.length === 0) {
		toast.error('At least one tag is required.', { id: toast_id });
		return false;
	}

	if (profile.tags.length > 4) {
		toast.error('Too many tags selected. Max is 4.', { id: toast_id });
		return false;
	}

	if (
		!profile.biography ||
		(profile.biography && profile.biography.trim().length === 0)
	) {
		toast.error("Biography can't be empty.", { id: toast_id });
		return false;
	}

	return true;
}

export async function editUserAuth(
	profile: AuthProfile,
	setErrors: React.Dispatch<React.SetStateAction<AuthProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<boolean> {
	const id = toast.loading('Editing authentication details...', {
		style: { minWidth: '350px' },
	});
	try {
		await store
			.dispatch(
				authApi.endpoints.editAuth.initiate({
					email: profile.email === '' ? undefined : profile.email,
					password:
						profile.password === '' ? undefined : profile.password,
					password_confirm:
						profile.password_confirm === ''
							? undefined
							: profile.password_confirm,
				}),
			)
			.unwrap();

		toast.success('Authentication details updated!', {
			id,
		});

		return true;
	} catch (error: unknown) {
		const editError = manageRTKQErrorDetails<AuthProfileError>(error, id);

		setErrors((c) => ({
			...c,
			email: editError?.email,
			password: editError?.password,
			password_confirm: editError?.password_confirm,
		}));

		setSubmitting(false);

		return false;
	}
}

export function hasProfileChanged(
	profile: CompleteProfile,
	base: CompleteProfile,
): boolean {
	return (
		profile.firstname !== base.firstname ||
		profile.lastname !== base.lastname ||
		profile.gender !== base.gender ||
		profile.orientation !== base.orientation ||
		profile.biography !== base.biography
	);
}

export async function editProfile(
	profile: CompleteProfile,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
): Promise<boolean> {
	const location = await getGeolocation();

	try {
		await store
			.dispatch(
				userApi.endpoints.userEdit.initiate({
					birthdate: profile.birthdate?.split('T')[0],
					firstname: profile.firstname,
					lastname: profile.lastname,
					gender: profile.gender,
					orientation: profile.orientation,
					biography: profile.biography,
					location,
				}),
			)
			.unwrap();

		return true;
	} catch (error: unknown) {
		const editError = manageRTKQErrorDetails<CompleteProfileError>(
			error,
			toast_id,
		);

		setErrors((c) => ({
			...c,
			birthdate: editError?.birthdate,
			firstname: editError?.firstname,
			lastname: editError?.lastname,
			biography: editError?.biography,
		}));
		setSubmitting(false);

		return false;
	}
}

export function hasTagsChanged(tags: string[], base: string[]): boolean {
	return JSON.stringify(tags.sort()) !== JSON.stringify(base.sort());
}

async function deleteOldTags(
	tags: string[],
	old_tags: Tag[],
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
) {
	const to_delete = old_tags.filter((t) => {
		return !tags.find((new_t) => t.name === new_t);
	});

	const promises = to_delete.map(async (p) => {
		await store.dispatch(
			userApi.endpoints.deleteUserTag.initiate({ id: p.id }),
		);
	});

	const res = await Promise.allSettled(promises);

	checkTagsErrorsInPromises(res, setErrors, setSubmitting, toast_id);

	return (
		!res.length || res.find((r) => r.status === 'rejected') === undefined
	);
}

function checkTagsErrorsInPromises(
	res: PromiseSettledResult<unknown>[],
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
) {
	res.forEach((r) => {
		if (r.status === 'rejected') {
			const tagsError = manageRTKQErrorDetails<TagsError>(
				r.reason,
				toast_id,
			);

			setErrors((c) => ({
				...c,
				tags: c.tags?.concat(tagsError?.name ?? []),
			}));
			setSubmitting(false);
		}
	});
}

export async function sendTags(
	profile: CompleteProfile,
	old_tags: Tag[],
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
): Promise<boolean> {
	await deleteOldTags(
		profile.tags,
		old_tags,
		setErrors,
		setSubmitting,
		toast_id,
	);

	const promises = profile.tags.map(
		async (t) =>
			await store
				.dispatch(userApi.endpoints.setUserTag.initiate({ name: t }))
				.unwrap(),
	);
	const res = await Promise.allSettled(promises);

	checkTagsErrorsInPromises(res, setErrors, setSubmitting, toast_id);

	return (
		!res.length || res.find((r) => r.status === 'rejected') === undefined
	);
}
