import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { manageRTKQErrorCause } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import { setAuthAccessToken } from '../store.slice';
import { cookie } from '@/tool/cookie';

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();

	// Note: Find better way to handle types
	const fields = {
		username: form.get('username') as string,
		password: form.get('password') as string,
	};

	const req = store.dispatch(authApi.endpoints.login.initiate(fields));

	try {
		await req.unwrap();

		store.dispatch(setAuthAccessToken(cookie('access-token')));

		// Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
		return redirect(
			new URL(request.url).searchParams.get('redirect') ?? `/`,
		);
	} catch (error: unknown) {
		return manageRTKQErrorCause(error);
	}
};
