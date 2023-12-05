import toast from 'react-hot-toast';
import {
	AuthProfile,
	AuthProfileError,
	CompleteProfile,
	CompleteProfileError,
	PictureError,
	TagsError,
	UserEditError,
} from './types';
import { getGeolocation } from '@/tool/getLocation';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import {
	EditUserMutationType,
	UploadUserPictureMutationType,
	UserTagMutationType,
} from './api.slice';
import { EditAuthMutationType } from '../auth/api.slice';

export function checkBeforeSubmitting(profile: CompleteProfile): boolean {
	if (profile.pictures && profile.pictures.length < 2) {
		toast.error('Select at least 2 images to start.');
		return false;
	}

	if (profile.tags.length > 4) {
		toast.error('Too many tags selected. Max is 4.');
		return false;
	}

	if (profile.biography.trim().length === 0) {
		toast.error("Biography can't be only spaces.");
		return false;
	}

	return true;
}

export async function editUserAuth(
	profile: AuthProfile,
	editAuth: EditAuthMutationType,
	setErrors: React.Dispatch<React.SetStateAction<AuthProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<boolean> {
	const id = toast.loading('Editing authentication details...', {
		style: { minWidth: '350px' },
	});
	try {
		await editAuth({
			...profile,
		}).unwrap();

		toast.success('Authentication details updated!', {
			id,
		});

		return true;
	} catch (error: unknown) {
		const editError = manageRTKQErrorDetails<AuthProfileError>(error);

		setErrors((c) => ({
			...c,
			email: editError?.email,
			password: editError?.password,
			password_confirm: editError?.password_confirm,
		}));

		toast.error('An error occurred!', { id });

		setSubmitting(false);

		return false;
	}
}

export async function editProfile(
	profile: CompleteProfile,
	editUser: EditUserMutationType,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<boolean> {
	const location = await getGeolocation();

	try {
		await editUser({
			birthdate: profile.birthdate,
			gender: profile.gender,
			orientation: profile.orientation,
			biography: profile.biography,
			location,
		}).unwrap();

		return true;
	} catch (error: unknown) {
		const editError = manageRTKQErrorDetails<UserEditError>(error);

		setErrors((c) => ({
			...c,
			birthdate: editError?.birthdate,
			gender: editError?.gender,
		}));
		setSubmitting(false);

		return false;
	}
}

export async function sendTags(
	profile: CompleteProfile,
	setTag: UserTagMutationType,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<boolean> {
	const promises = profile.tags.map(
		async (t) => await setTag({ name: t }).unwrap(),
	);
	const res = await Promise.allSettled(promises);

	res.forEach((r) => {
		if (r.status === 'rejected') {
			const tagsError = manageRTKQErrorDetails<TagsError>(r.reason);

			setErrors((c) => ({
				...c,
				tags: c.tags?.concat(tagsError?.name ?? []),
			}));
			setSubmitting(false);
		}
	});

	return (
		!res.length || res.find((r) => r.status === 'rejected') === undefined
	);
}

export async function uploadImages(
	profile: CompleteProfile,
	editUser: EditUserMutationType,
	uploadUserPicture: UploadUserPictureMutationType,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<boolean> {
	const promises = profile.pictures.map(async (p) => {
		const formData = new FormData();

		formData.append('picture', p);

		return await uploadUserPicture(formData).unwrap();
	});

	const res = await Promise.allSettled(promises);

	res.forEach((r) => {
		if (r.status === 'rejected') {
			const imageError = manageRTKQErrorDetails<PictureError>(r.reason);

			setErrors((c) => ({
				...c,
				pictures: c.pictures?.concat(imageError?.picture ?? []),
			}));
			setSubmitting(false);
		}
	});

	// Set first picture as profile picture

	const first_picture = res.find((r) => r.status === 'fulfilled');

	if (first_picture && first_picture.status === 'fulfilled')
		await editUser({ id_picture: first_picture.value.id }).unwrap();

	return (
		!res.length || res.find((r) => r.status === 'rejected') === undefined
	);
}
