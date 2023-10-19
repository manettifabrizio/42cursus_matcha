import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { manageRTKQErrorCause } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import { setAuthAccessToken } from '../store.slice';
import { cookie } from '@/tool/cookie';
import { setUser } from '@/feature/user/store.slice';

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();

	const fields = {
		username: form.get('username') as string,
		password: form.get('password') as string,
	};

	const req = store.dispatch(authApi.endpoints.login.initiate(fields));

	try {
		const res = await req.unwrap();

		store.dispatch(setAuthAccessToken(cookie('access-token')));
		store.dispatch(setUser(res));

		// Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
		return redirect(
			new URL(request.url).searchParams.get('redirect') ?? `/`,
		);
	} catch (error: unknown) {
		return manageRTKQErrorCause(error);
	}
};
