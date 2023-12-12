import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import toast from 'react-hot-toast';
import { EditUserMutationType, userApi } from './api.slice';
import { CompleteProfile, CompleteProfileError, PictureError } from './types';
import { store } from '@/core/store';

async function uploadImage(picture: File) {
	const formData = new FormData();

	formData.append('picture', picture);

	return await store
		.dispatch(userApi.endpoints.uploadUserPicture.initiate(formData))
		.unwrap();
}

async function uploadProfilePicture(
	profile: CompleteProfile,
	editUser: EditUserMutationType,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
) {
	if (!profile?.profile_picture?.file) {
		toast.error('No profile picture selected.', { id: toast_id });
		return false;
	}

	return await uploadImage(profile.profile_picture.file)
		.then((res) => {
			if (res.id) {
				editUser({ id_picture: res.id })
					.then(() => {
						return true;
					})
					.catch((error) => {
						toast.error('Error while setting profile picture.', {
							id: toast_id,
						});
						console.error(error);
						return false;
					});
			}
			return false;
		})
		.catch((error) => {
			checkErrorsInPromises(error, setErrors, setSubmitting, toast_id);
			return false;
		});
}

async function filterImages(
	profile: CompleteProfile,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
) {
	// Remove images that are already uploaded
	const already_uploaded = store.getState().user.pictures;

	const pictures = profile.pictures.filter((p) => {
		if (p.id === undefined) return true;

		return !already_uploaded.find((a) => a.id === p.id);
	});

	// Delete images that are not selected
	const selected = profile.pictures.filter((p) => p.id !== undefined);

	const to_delete = already_uploaded.filter((a) => {
		return !selected.find((s) => s.id === a.id);
	});

	const promises = to_delete.map(async (p) => {
		await store.dispatch(
			userApi.endpoints.deleteUserPicture.initiate({ id: p.id }),
		);
	});

	const res = await Promise.allSettled(promises);

	checkErrorsInPromises(res, setErrors, setSubmitting, toast_id);

	// Remove profile picture from pictures
	const profile_picture = profile.profile_picture;

	if (profile_picture && !profile_picture.id) {
		const index = pictures.findIndex(
			(p) => p.file.name === profile_picture.file.name,
		);

		if (index !== -1) pictures.splice(index, 1);
	}

	return pictures;
}

function checkErrorsInPromises(
	error: unknown,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
) {
	const imageError = manageRTKQErrorDetails<PictureError>(error, toast_id);

	setErrors((c) => ({
		...c,
		pictures: c.pictures?.concat(imageError?.picture ?? []),
	}));
	setSubmitting(false);
}

export async function uploadImages(
	profile: CompleteProfile,
	editUser: EditUserMutationType,
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
): Promise<boolean> {
	console.log('uploadImage profile', profile);
	const pictures = await filterImages(
		profile,
		setErrors,
		setSubmitting,
		toast_id,
	);

	console.log('uploadImage filtered pictures', pictures);

	if (!profile.profile_picture?.id)
		await uploadProfilePicture(
			profile,
			editUser,
			setErrors,
			setSubmitting,
			toast_id,
		);

	const promises = pictures.map(async (p) => uploadImage(p.file));

	const res = await Promise.allSettled(promises);
	res.forEach((r) => {
		if (r.status === 'rejected') {
			checkErrorsInPromises(r.reason, setErrors, setSubmitting, toast_id);
		}
	});

	return (
		!res.length || res.find((r) => r.status === 'rejected') === undefined
	);
}
