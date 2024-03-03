import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isProfileCompleted } from '@/tool/userTools';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '@/core/store';
import { useEffect } from 'react';
import { setUrl } from '@/feature/interactions/store.slice';

// Type ------------------------------------------------------------------------
interface Props {
	accepted: 'AUTHENTICATED' | 'UNAUTHENTICATED';
	inverted?: boolean;
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted, inverted }: Props) {
	const isAuthenticated = localStorage.getItem('is_authenticated');
	const location_state = useLocation();
	const dispatch = useDispatch();
	const user = useSelector((state: StoreState) => state.user);

	useEffect(() => {
		if (location_state.pathname.startsWith('/home'))
			dispatch(setUrl('home'));
		else if (location_state.pathname.startsWith('/user'))
			dispatch(setUrl('user'));
		else if (location_state.pathname.startsWith('/chat'))
			dispatch(setUrl('chat'));
	}, [location_state, dispatch]);

	// Note: Base is irrelevant, just there to be able to use URL
	const redirectTo = new URL(
		`${location_state.pathname}${location_state.search}`,
		`https://localhost`,
	).searchParams.get('redirect');

	// isAuthenticated
	// null => user has been logged out automatically (redirect)
	// false => user has logged out manually (no redirect)
	// true => user is logged in

	if (accepted === 'AUTHENTICATED' && isAuthenticated == null)
		return <Navigate to={`/auth/login?redirect=${location_state.pathname}`} />;

	if (accepted === 'AUTHENTICATED' && isAuthenticated === 'false')
		return <Navigate to={`/auth/login`} />;

	if (accepted === 'UNAUTHENTICATED' && isAuthenticated === 'true')
		return <Navigate to={redirectTo ?? '/home'} replace />;

	const page = isProfileCompleted(user);

	const url_page =
		Number(new URLSearchParams(location_state.search).get('page')) ?? page;

	if (
		isAuthenticated === 'true' &&
		page !== undefined &&
		(location_state.pathname !== '/user/complete-profile' || page !== url_page)
	) {
		return (
			<Navigate
				to={`/user/complete-profile?redirect=${location_state.pathname}&page=${page}`}
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
