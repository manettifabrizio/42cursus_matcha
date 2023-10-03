import type { ActionFunction } from 'react-router-dom';
import type { ApiErrorResponse } from '@/core/api';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';

// Type ------------------------------------------------------------------------
export type ResetPasswordError = {
    username?: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();

    const fields = {
        username: form.get('username') as string,
        email: form.get('email') as string
    };

    const req = store.dispatch(
        authApi.endpoints.reset_password.initiate(fields)
    );

    try {
        await req.unwrap();

        // Note: Doesn't work unless removed ProtectedLayout for the route (/auth/login)
        return redirect(
            new URL(request.url).searchParams.get('redirect') ?? `/`
        );
    } catch (error: unknown) {
        if (isRTKQFetchBaseQueryError(error)) {
            const resetPasswordError =
                error.data as ApiErrorResponse<ResetPasswordError>;

            if ('cause' in resetPasswordError.error) {
                return { password: [resetPasswordError.error.cause] };
            }

            return resetPasswordError.error;
        }

        return null; // Todo: Handle error ?
    }
};
