import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { StoreState } from './store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { cookie } from '@/tool/cookie';
import { router } from './router';

// Type ------------------------------------------------------------------------
export type ApiErrorResponse<T = { [field: string]: string[] }> = {
	status: {
		code: number;
		text: string;
	};
	error: {
		cause: string;
		details?: T;
	};
};

// Variable --------------------------------------------------------------------
const mutex = new Mutex();

// Fetch -----------------------------------------------------------------------
const fetchBase = fetchBaseQuery({
	baseUrl: '/api',
	credentials: 'same-origin',
	prepareHeaders: (headers, { getState }) => {
		const store = getState() as StoreState;

		// CSRF
		const csrfToken = cookie('csrf-token');

		if (csrfToken !== null) {
			headers.set('csrf-token', `${csrfToken}`);
		}

		// JWT Access
		const accessToken = store.auth.accessToken;

		if (accessToken !== null) {
			headers.set('authorization', `Bearer ${accessToken}`);
		}

		return headers;
	},
});

const fetchAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	await mutex.waitForUnlock();

	let response = await fetchBase(args, api, extraOptions);

	const isJwtError = ['ExpiredJwt'].includes(
		(response.error?.data as ApiErrorResponse)?.error?.cause,
	);

	if (response.error?.status === 401 && isJwtError) {
		if (!mutex.isLocked()) {
			const mutexRelease = await mutex.acquire();

			try {
				const res = await fetchBase(
					{ url: 'auth/refresh', method: 'POST' },
					api,
					extraOptions,
				);

				if (res.error) {
					router.navigate('/auth/logout');
				} else {
					api.dispatch({
						type: 'auth/setAuthAccessToken',
						payload: cookie('access-token'),
					});

					response = await fetchBase(args, api, extraOptions);
				}
			} finally {
				mutexRelease();
			}
		} else {
			await mutex.waitForUnlock();
			response = await fetchBase(args, api, extraOptions);
		}
	}

	return response;
};

// Api -------------------------------------------------------------------------
export const api = createApi({
	baseQuery: fetchAuth,
	endpoints: () => ({}),
	tagTypes: ['User', 'Matches'],
});
