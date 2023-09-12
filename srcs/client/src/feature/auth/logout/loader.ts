import type { LoaderFunction } from 'react-router-dom';
import { redirect }            from 'react-router-dom';
import { store }               from '@/core/store';
import { authApi }             from '../api.slice';
import { reset }               from '../store.slice';

// Loader ----------------------------------------------------------------------
export const loader: LoaderFunction = async () =>
{
	await store.dispatch(authApi.endpoints.logout.initiate());

	store.dispatch(reset());

	return redirect('/');
};
