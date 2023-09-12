import type { ActionFunction }       from 'react-router-dom';
import type { ApiErrorResponse }     from '@/core/api';
import { redirect }                  from 'react-router-dom';
import { store }                     from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi }                   from '../api.slice';
import { setAccessToken }            from '../store.slice';

// Type ------------------------------------------------------------------------
export type LoginError =
{
	username?: string[];
	password?: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request, params }) =>
{
	const form = await request.formData();

	// Note: Find better way to handle types
	const fields =
	{
		username: form.get('username') as string,
		password: form.get('password') as string,
	};

	const response = await store.dispatch(authApi.endpoints.login.initiate(fields));

	if ('error' in response)
	{
		const error = response.error;

		if (error && !isRTKQFetchBaseQueryError(error))
		{
			return null; // Todo: Handle error ?
		}

		const loginError = error.data as ApiErrorResponse<LoginError>;

		if ('cause' in loginError.error)
		{
			return { username: [ loginError.error.cause ] };
		}

		return loginError.error;
	}

	// Note: Set to anything but null, so access-token will be automatically refresh
	store.dispatch(setAccessToken('1'));

	return redirect(params.redirect ?? `/`);
};
