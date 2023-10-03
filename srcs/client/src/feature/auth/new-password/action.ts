import type { ActionFunction } from 'react-router-dom';
import type { ApiErrorResponse } from '@/core/api';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { isRTKQFetchBaseQueryError } from '@/tool/isRTKQError';
import { authApi } from '../api.slice';
import { toast } from 'react-toastify';

// Type ------------------------------------------------------------------------

export type NewPasswordError = {
    password: string[];
    password_confirm: string[];
};

// Action ----------------------------------------------------------------------
export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();

    // Note: Find better way to handle types
    const fields = {
        password: form.get('password') as string,
        password_confirm: form.get('password_confirm') as string
    };

    const req = store.dispatch(
        authApi.endpoints.edit_password.initiate(fields)
    );

    try {
        await req.unwrap();

        return redirect(`/auth/new-password/confirm`);
    } catch (error: unknown) {
        if (isRTKQFetchBaseQueryError(error)) {
            const registerError =
                error.data as ApiErrorResponse<NewPasswordError>;

            if ('cause' in registerError.error) {
                return { username: [registerError.error.cause] };
            }

            toast.error(
                `Error while creating the account: ${registerError.error}`
            );

            return registerError.error;
        }

        return null;
    }
};
