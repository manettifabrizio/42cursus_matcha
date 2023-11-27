import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { authApi } from '../api.slice';
import toast from 'react-hot-toast';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';

// Type ------------------------------------------------------------------------

export type RegisterError = {
	username: string[];
	password: string[];
	password_confirm: string[];
	email: string[];
	firstname: string[];
	lastname: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();

	// Note: Find better way to handle types
	const fields = {
		username: form.get('username') as string,
		password: form.get('password') as string,
		password_confirm: form.get('password_confirm') as string,
		email: form.get('email') as string,
		firstname: form.get('firstname') as string,
		lastname: form.get('lastname') as string,
	};

	const req = store.dispatch(authApi.endpoints.register.initiate(fields));

	try {
		const res = await req.unwrap();

		toast.success(
			`Account successfully created! An email was sent to ${fields.email} please confirm to log in.`,
		);
		return redirect(`/auth/login?id=${res.id}`);
	} catch (error: unknown) {
		return manageRTKQErrorDetails<RegisterError>(error);
	}
};
