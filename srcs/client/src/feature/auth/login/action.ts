import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import {
	manageRTKQErrorCause,
	manageRTKQErrorDetails,
} from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import { cookie } from '@/tool/cookie';
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
		await req.unwrap();

		store.dispatch({
			type: 'auth/setAuthAccessToken',
			payload: cookie('access-token'),
		});
		store.dispatch(startConnecting());

		return redirect(
			new URL(request.url).searchParams.get('redirect') ?? `/home`,
		);
	} catch (error: unknown) {
		if (
			!fields.username ||
			fields.username === '' ||
			!fields.password ||
			fields.password === ''
		)
			return manageRTKQErrorDetails(error);

		return { password: manageRTKQErrorCause(error) };
	}
};
