import type { ActionFunction } from 'react-router-dom';
import type { ApiErrorResponse } from '@/core/api';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi } from '../../auth/api.slice';
import { setAuthAccessToken } from '../../auth/store.slice';
import { cookie } from '@/tool/cookie';
import { userApi } from '../api.slice';

// Type ------------------------------------------------------------------------
export type CompleteProfileError = {
	username?: string[];
	password?: string[];
};

async function sendTags(request: Request, tags: string[]) {
	tags.map(async (t) => {
		const req = store.dispatch(
			userApi.endpoints.setUserTag.initiate({ name: t }),
		);

		try {
			await req.unwrap();

			// Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
			console.log('success: ', t);
		} catch (error: unknown) {
			if (isRTKQFetchBaseQueryError(error)) {
				const completeProfileError =
					error.data as ApiErrorResponse<CompleteProfileError>;

				if ('cause' in completeProfileError.error) {
					return { password: [completeProfileError.error.cause] };
				}

				return completeProfileError.error;
			}

			return null; // Todo: Handle error ?
		}
	});
}

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();

	// Note: Find better way to handle types
	const fields = {
		birthday: form.get('birthday') as string,
		tags: form.get('tags[]') as string,
		gender: form.get('gender') as string,
		images: form.get('pictures') as string,
	};

	sendTags(request, fields.tags.split(','));

	// const req = store.dispatch(authApi.endpoints.login.initiate(fields));

	try {
		// await req.unwrap();

		// Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
		return redirect(
			new URL(request.url).searchParams.get('redirect') ?? `/`,
		);
	} catch (error: unknown) {
		if (isRTKQFetchBaseQueryError(error)) {
			const completeProfileError =
				error.data as ApiErrorResponse<CompleteProfileError>;

			if ('cause' in completeProfileError.error) {
				return { password: [completeProfileError.error.cause] };
			}

			return completeProfileError.error;
		}

		return null; // Todo: Handle error ?
	}
};
