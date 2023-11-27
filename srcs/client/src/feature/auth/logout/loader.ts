import type { LoaderFunction } from 'react-router-dom';
import { store } from '@/core/store';
import { authApi } from '../api.slice';
import { clearAuth } from '../store.slice';
import toast from 'react-hot-toast';

// Loader ----------------------------------------------------------------------
export const loader: LoaderFunction = async () => {
	const req = store.dispatch(authApi.endpoints.logout.initiate());

	try {
		await req.unwrap();

		store.dispatch(clearAuth());
	} catch (error: unknown) {
		toast.error(`Error: logout failed.`);
		console.error(`Error logout failed: ${JSON.stringify(error)}`);
	}
};
