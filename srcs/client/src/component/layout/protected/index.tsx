import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isProfileCompleted } from '@/tool/userTools';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUrl } from '@/feature/interactions/store.slice';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import { clearAuth } from '@/feature/auth/store.slice';
import LoadingSpinner from '@/component/ui/loadingSpinner';

// Type ------------------------------------------------------------------------
interface Props {
	accepted: 'AUTHENTICATED' | 'UNAUTHENTICATED';
	inverted?: boolean;
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted, inverted }: Props) {
	const isAuthenticated = localStorage.getItem('is_authenticated');
	const isCompleted = localStorage.getItem('is_completed');
	const location_state = useLocation();
	const dispatch = useDispatch();
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery(undefined, {
		skip: isAuthenticated === 'false' || isCompleted === 'true',
	});

	useEffect(() => {
		if (location_state.pathname.startsWith('/home'))
			dispatch(setUrl('home'));
		else if (location_state.pathname.startsWith('/user/profile'))
			dispatch(setUrl('user'));
		else if (location_state.pathname.startsWith('/chat'))
			dispatch(setUrl('chat'));
	}, [location_state, dispatch]);

	// isAuthenticated
	// null => user has been logged out automatically (redirect)
	// false => user has logged out manually (no redirect)
	// true => user is logged in

	if (accepted === 'AUTHENTICATED' && isAuthenticated == null) {
		if (isAuthenticated == null)
			return (
				<Navigate
					to={`/auth/login?redirect=${location_state.pathname}`}
				/>
			);
		else if (isAuthenticated === 'false') {
			return <Navigate to={`/auth/login`} />;
		}
	}

	if (accepted === 'UNAUTHENTICATED' && isAuthenticated === 'true') {
		const redirectTo = new URLSearchParams(location_state.search).get(
			'redirect',
		);
		return <Navigate to={redirectTo ?? '/home'} replace />;
	}

	if (isError) {
		toast.error(`Error: User not found`);
		dispatch(clearAuth());
		return <Navigate to="/" />;
	}

	if (
		!isCompleted &&
		accepted === 'AUTHENTICATED' &&
		isAuthenticated === 'true' &&
		(isFetching || isLoading || !data)
	)
		return (
			<div className="w-full h-svh flex justify-center items-center bg-transparent">
				<LoadingSpinner message="Checking profile completion..." />
			</div>
		);

	const page = data ? isProfileCompleted(data) : 1;

	const url_page =
		Number(new URLSearchParams(location_state.search).get('page')) ?? page;

	if (
		isAuthenticated === 'true' &&
		page !== undefined &&
		(location_state.pathname !== '/user/complete-profile' ||
			page !== url_page)
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
