import { Navigate }    from 'react-router-dom';
import { Outlet }      from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth }     from '@/hook/useAuth';

// Type ------------------------------------------------------------------------
type Props =
{
	accepted: 'AUTHENTICATED'|'UNAUTHENTICATED';
};

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted }: Props)
{
	const location = useLocation();
	const { isAuthenticated } = useAuth();

	return (
		(accepted === 'AUTHENTICATED' && !isAuthenticated)
			? <Navigate to={`/auth/login?redirect=${location.pathname}`} /> :
		(accepted === 'UNAUTHENTICATED' && isAuthenticated)
			? <Navigate to={`/`} replace={true} />
			: <Outlet />
	);
}
