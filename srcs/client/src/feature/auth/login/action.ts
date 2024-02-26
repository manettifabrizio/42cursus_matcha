import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { manageRTKQErrorCause } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import { cookie } from '@/tool/cookie';
import { setUser } from '@/feature/user/store.slice';
import { startConnecting } from '@/feature/interactions/store.slice';

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

		store.dispatch({
			type: 'auth/setAuthAccessToken',
			payload: cookie('access-token'),
		});
		store.dispatch(setUser(res));
		store.dispatch(startConnecting());

		return redirect(
			new URL(request.url).searchParams.get('redirect') ?? `/`,
		);
	} catch (error: unknown) {
		return manageRTKQErrorCause(error);
	}
};
