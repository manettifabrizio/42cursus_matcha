import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isProfileCompleted } from '@/tool/userTools';
import { useSelector } from 'react-redux';
import { StoreState } from '@/core/store';

// Type ------------------------------------------------------------------------
interface Props {
	accepted: 'AUTHENTICATED' | 'UNAUTHENTICATED';
	inverted?: boolean;
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted, inverted }: Props) {
	const isAuthenticated = localStorage.getItem('is_authenticated');
	const location = useLocation();
	const user = useSelector((state: StoreState) => state.user);

	// Note: Base is irrelevant, just there to be able to use URL
	const redirectTo = new URL(
		`${location.pathname}${location.search}`,
		`https://localhost`,
	).searchParams.get('redirect');

	// isAuthenticated
	// null => user has been logged out automatically (redirect)
	// false => user has logged out manually (no redirect)
	// true => user is logged in

	if (accepted === 'AUTHENTICATED' && isAuthenticated == null)
		return <Navigate to={`/auth/login?redirect=${location.pathname}`} />;

	if (accepted === 'AUTHENTICATED' && isAuthenticated === 'false')
		return <Navigate to={`/auth/login`} />;

	if (accepted === 'UNAUTHENTICATED' && isAuthenticated === 'true')
		return <Navigate to={redirectTo ?? '/home'} replace />;

	const page = isProfileCompleted(user);

	const url_page =
		Number(new URLSearchParams(location.search).get('page')) ?? page;

	if (
		isAuthenticated === 'true' &&
		page !== undefined &&
		(location.pathname !== '/user/complete-profile' || page !== url_page)
	) {
		return (
			<Navigate
				to={`/user/complete-profile?redirect=${location.pathname}&page=${page}`}
			/>
		);
	}

	return (
		<div className="black-background relative h-svh overflow-hidden">
			{inverted ? (
				<>
					<div className="ellipse-left absolute bottom-0 right-0 bg-red-600 rounded-full -z-30"></div>
					<div className="ellipse-right absolute top-0 left-0 bg-amber-400 rounded-full -z-30"></div>
				</>
			) : (
				<>
					<div className="ellipse-left absolute bottom-0 left-0 bg-red-600 rounded-full -z-30"></div>
					<div className="ellipse-right absolute top-0 right-0 bg-amber-400 rounded-full -z-30"></div>
				</>
			)}

			<Outlet />
		</div>
	);
}
