import { Navigate }    from 'react-router-dom';
import { Outlet }      from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { selectAuth }  from '@/feature/auth/store.slice';
import { useStoreSelector } from '@/hook/useStore';

// Type ------------------------------------------------------------------------
interface Props
{
	accepted: 'AUTHENTICATED'|'UNAUTHENTICATED';
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted }: Props)
{
	const isAuthenticated = !!useStoreSelector(selectAuth).accessToken;
	const location = useLocation();

	// Note: Base is irrelevant, just there to be able to use URL
	const redirectTo = new URL(`${location.pathname}${location.search}`, `https://localhost`).searchParams.get('redirect');

	return (
		(accepted === 'AUTHENTICATED' && !isAuthenticated)
			? <Navigate to={`/auth/login?redirect=${location.pathname}`} /> :
		(accepted === 'UNAUTHENTICATED' && isAuthenticated)
			? <Navigate to={ redirectTo ?? '/' } replace />
			: <Outlet />
	);
}
