import type { BaseQueryFn }         from '@reduxjs/toolkit/query';
import type { FetchArgs }           from '@reduxjs/toolkit/query';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { StoreState }          from './store';
import { createApi }                from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery }           from '@reduxjs/toolkit/query/react';
import { Mutex }                    from 'async-mutex';
import { setAccessToken }           from '@/feature/auth/store.slice';
import { cookie }                   from '@/tool/cookie';

// Type ------------------------------------------------------------------------
export type ApiErrorResponse<T = { cause: string; }> =
{
	error: T | { cause: string; };
	status:
	{
		code: number;
		text: string;
	}
};

// Variable --------------------------------------------------------------------
const mutex = new Mutex();

// Fetch -----------------------------------------------------------------------
const fetchBase = fetchBaseQuery(
{
	baseUrl: '/api',
	credentials: 'same-origin',
	prepareHeaders: (headers, { getState }) =>
	{
		const store = getState() as StoreState;

		// CSRF
		const csrfToken = store.security.csrfToken;

		if (csrfToken !== null)
		{
			headers.set('csrf-token', `${csrfToken}`);
		}

		// JWT Access
		const accessToken = store.auth.accessToken;

		if (accessToken !== null)
		{
			headers.set('authorization', `Bearer ${accessToken}`);
		}

		return headers
	},
});

const fetchAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) =>
{
	await mutex.waitForUnlock();

	let response = await fetchBase(args, api, extraOptions);

	const isExpiredJwtError = (response.error?.data
		&& (response.error.data as ApiErrorResponse)?.error?.cause === 'ExpiredJwt'
	);

	if (response.error?.status === 401 && isExpiredJwtError)
	{
		if (!mutex.isLocked())
		{
			const mutexRelease = await mutex.acquire();

			try
			{
				const refreshResult = await fetchBase({
					url: 'auth/refresh',
					method: 'POST'
				}, api, extraOptions);

				if (refreshResult.data)
				{
					api.dispatch(setAccessToken(cookie('access-token')));
					response = await fetchBase(args, api, extraOptions);
				}
			}
			finally
			{
				mutexRelease();
			}
		}
		else
		{
			await mutex.waitForUnlock();
			response = await fetchBase(args, api, extraOptions);
		}
	}

	return (response);
}

// Api -------------------------------------------------------------------------
export const api = createApi(
{
	baseQuery: fetchAuth,
	endpoints: () => ({})
});
