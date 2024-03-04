import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { isLinkInvalidError, manageRTKQErrorDetails } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import toast from 'react-hot-toast';

// Type ------------------------------------------------------------------------

export type NewPasswordError = {
	password: string[];
	password_confirm: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const urlParams = new URLSearchParams(window.location.search);

	const fields = {
		id: urlParams.get('id') as string,
		secret: urlParams.get('secret') as string,
		password: form.get('password') as string,
		password_confirm: form.get('password_confirm') as string,
	};

	const req = store.dispatch(
		authApi.endpoints.updatePassword.initiate(fields),
	);

	const id = toast.loading('Loading...', {
		style: { minWidth: '350px' },
	});

	try {
		await req.unwrap();

		toast.success('Password updated!', { id });

		return redirect(`/auth/new-password/confirm`);
	} catch (error: unknown) {
		if (isLinkInvalidError(error, 'auth/reset-password', id)) return null;
		return manageRTKQErrorDetails(error, id);
	}
};
