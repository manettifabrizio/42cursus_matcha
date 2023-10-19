import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { selectAuth } from '@/feature/auth/store.slice';
import { useStoreSelector } from '@/hook/useStore';
import { isProfileCompleted } from '@/tool/userTools';

// Type ------------------------------------------------------------------------
interface Props {
	accepted: 'AUTHENTICATED' | 'UNAUTHENTICATED';
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted }: Props) {
	const isAuthenticated = !!useStoreSelector(selectAuth).accessToken;
	const location = useLocation();

	// Note: Base is irrelevant, just there to be able to use URL
	const redirectTo = new URL(
		`${location.pathname}${location.search}`,
		`https://localhost`,
	).searchParams.get('redirect');

	if (accepted === 'AUTHENTICATED' && !isAuthenticated)
		return <Navigate to={`/auth/login?redirect=${location.pathname}`} />;

	if (accepted === 'UNAUTHENTICATED' && isAuthenticated)
		return <Navigate to={redirectTo ?? '/home'} replace />;

	if (
		isAuthenticated &&
		!isProfileCompleted() &&
		location.pathname !== '/user/complete-profile'
	) {
		return (
			<Navigate
				to={`/user/complete-profile?redirect=${location.pathname}`}
			/>
		);
	}

	return (
		<div className="black-background relative h-screen overflow-hidden">
			<div className="ellipse absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-red-600 rounded-full -z-30"></div>
			<div className="ellipse absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-amber-400 rounded-full -z-30"></div>

			<Outlet />
		</div>
	);
}
