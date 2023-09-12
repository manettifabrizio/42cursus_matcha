import type { ActionFunction }       from 'react-router-dom';
import type { ApiErrorResponse }     from '@/core/api';
import { redirect }                  from 'react-router-dom';
import { store }                     from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi }                   from '../api.slice';

// Type ------------------------------------------------------------------------
export type RegisterError =
{
	username: string[];
	password: string[];
	password_confirm: string[];
	email: string[];
	firstname: string[];
	lastname: string[];
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
		password_confirm: form.get('password_confirm') as string,
		email: form.get('email') as string,
		firstname: form.get('firstname') as string,
		lastname: form.get('lastname') as string,
	};

	const response = await store.dispatch(authApi.endpoints.register.initiate(fields));

	if ('error' in response)
	{
		const error = response.error;

		if (error && !isRTKQFetchBaseQueryError(error))
		{
			return null; // Todo: Handle error ?
		}

		const registerError = error.data as ApiErrorResponse<RegisterError>;

		if ('cause' in registerError.error)
		{
			return { username: [ registerError.error.cause ] };
		}

		return registerError.error;
	}

	return redirect(`/auth/login?id=${response.data.id}`);
};
