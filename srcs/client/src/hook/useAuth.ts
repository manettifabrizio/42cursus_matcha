import { reset }            from '@/feature/auth/store.slice';
import { selectAuth }       from '@/feature/auth/store.slice';
import { useStoreDispatch } from './useStore';
import { useStoreSelector } from './useStore';

// Hook ------------------------------------------------------------------------
export const useAuth = () =>
{
	const dispatch = useStoreDispatch();
	const auth = useStoreSelector(selectAuth);

	const resetStore = () =>
	{
		dispatch(reset);
	};

	return ({
		resetStore,
		isAuthenticated: !!auth.accessToken,
	});
};
