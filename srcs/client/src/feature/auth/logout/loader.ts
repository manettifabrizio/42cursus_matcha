import type { LoaderFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { store } from '@/core/store';
import { authApi } from '../api.slice';
import { clearAuth } from '../store.slice';

// Loader ----------------------------------------------------------------------
export const loader: LoaderFunction = async () => {
    const req = store.dispatch(authApi.endpoints.logout.initiate());

    try {
        await req.unwrap();
    } catch (error: unknown) {
        console.log(`Feat::Auth::Logout: Loader failed.`); // Todo: Remove ?
    }

    store.dispatch(clearAuth());

    return redirect('/');
};
