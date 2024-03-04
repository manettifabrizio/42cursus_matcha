import {
	manageRTKQErrorCause,
	manageRTKQErrorDetails,
} from '@/tool/isRTKQError';
import toast from 'react-hot-toast';
import { userApi } from './api.slice';
import { PicturesProfileError, PictureError } from './types';
import { store } from '@/core/store';

async function uploadImage(picture: File) {
	const formData = new FormData();

	formData.append('picture', picture);

	return await store
		.dispatch(userApi.endpoints.uploadUserPicture.initiate(formData))
		.unwrap();
}

export async function uploadProfilePicture(
	id: number,
	setErrors: React.Dispatch<React.SetStateAction<PicturesProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const toast_id = toast.loading('Setting profile picture...');

	return await store
		.dispatch(userApi.endpoints.userEdit.initiate({ id_picture: id }))
		.then(() => {
			setSubmitting(false);
			toast.success('Profile picture set.', { id: toast_id });
			return true;
		})
		.catch((error) => {
			checkErrorsInPromises(error, setErrors, setSubmitting, toast_id);
			return false;
		});
}

export async function deletePicture(
	picture_id: number,
	setErrors: React.Dispatch<React.SetStateAction<PicturesProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const toast_id = toast.loading('Deleting picture...');

	setSubmitting(true);

	const res = store.dispatch(
		userApi.endpoints.deleteUserPicture.initiate({ id: picture_id }),
	);

	return await res
		.unwrap()
		.then(() => {
			toast.success('Picture deleted.', { id: toast_id });
			setSubmitting(false);
			return true;
		})
		.catch((error) => {
			checkErrorsInPromises(
				error,
				setErrors,
				setSubmitting,
				toast_id,
				true,
			);
			return false;
		});
}

function checkErrorsInPromises(
	error: unknown,
	setErrors: React.Dispatch<React.SetStateAction<PicturesProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
	cause: boolean = false,
) {
	if (cause) {
		const imageError = manageRTKQErrorCause(error, toast_id);

		setErrors((c) => ({
			...c,
			pictures: c.pictures?.concat(imageError ?? []),
		}));
	} else {
		const imageError = manageRTKQErrorDetails<PictureError>(
			error,
			toast_id,
		);

		setErrors((c) => ({
			...c,
			pictures: c.pictures?.concat(imageError?.picture ?? []),
		}));
	}

	setSubmitting(false);
}

export async function uploadPicture(
	picture: File,
	setErrors: React.Dispatch<React.SetStateAction<PicturesProfileError>>,
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
	toast_id: string,
): Promise<number | undefined> {
	return await uploadImage(picture)
		.then(async (res) => {
			return res.id;
		})
		.catch((error) => {
			checkErrorsInPromises(error, setErrors, setSubmitting, toast_id);
			return undefined;
		});
}
