import type { LoaderFunction } from 'react-router-dom';
import { authApi } from '../api.slice';
import { store } from '@/core/store';
import { clearAuth } from '../store.slice';
import toast from 'react-hot-toast';

// Loader ----------------------------------------------------------------------
export const loader: LoaderFunction = async () => {
	const req = store.dispatch(authApi.endpoints.logout.initiate({}));

	try {
		await req.unwrap();

		store.dispatch(clearAuth());
		// Reset store state on logout
		store.dispatch({ type: 'resetAll' });
	} catch (error: unknown) {
		toast.error(`Error: logout failed.`);
		console.error(`Error logout failed: ${JSON.stringify(error)}`);
	}

	return null;
};
