import type { ActionFunction }       from 'react-router-dom';
import type { ApiErrorResponse }     from '@/core/api';
import { redirect }                  from 'react-router-dom';
import { store }                     from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi }                   from '../api.slice';
import { setAuthAccessToken }        from '../store.slice';
import { cookie }                    from '@/tool/cookie';

// Type ------------------------------------------------------------------------
export type LoginError =
{
	username?: string[];
	password?: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) =>
{
	const form = await request.formData();

	// Note: Find better way to handle types
	const fields =
	{
		username: form.get('username') as string,
		password: form.get('password') as string,
	};

	const req = store.dispatch(authApi.endpoints.login.initiate(fields));

	try
	{
		await req.unwrap();

		store.dispatch(setAuthAccessToken(cookie('access-token')));

		// Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
		return redirect(new URL(request.url).searchParams.get('redirect') ?? `/`);
	}
	catch (error: unknown)
	{
		if (isRTKQFetchBaseQueryError(error))
		{
			const loginError = error.data as ApiErrorResponse<LoginError>;

			if ('cause' in loginError.error)
			{
				return { username: [ loginError.error.cause ] };
			}

			return loginError.error;
		}

		return null; // Todo: Handle error ?
	}
};
