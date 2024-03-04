import type { ActionFunction } from 'react-router-dom';
import { store } from '@/core/store';
import {
	manageRTKQErrorCause,
	manageRTKQErrorDetails,
} from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import toast from 'react-hot-toast';

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();

	const fields = {
		username: form.get('username') as string,
		email: form.get('email') as string,
	};

	const req = store.dispatch(
		authApi.endpoints.resetPassword.initiate(fields),
	);

	const id = toast.loading('Searching your account...', {
		style: { minWidth: '350px' },
	});

	try {
		await req.unwrap();

		toast.success(
			`Account found. An email has been sent to ${fields.email}.`,
			{ id },
		);

		return null;
	} catch (error: unknown) {
		if (
			!fields.username ||
			fields.username === '' ||
			!fields.email ||
			fields.email === ''
		)
			return manageRTKQErrorDetails(error, id);

		return { email: manageRTKQErrorCause(error, id) };
	}
};
