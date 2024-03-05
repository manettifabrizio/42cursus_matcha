import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { isProfileCompleted, notEmpty } from '@/tool/userTools';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
	setLikedUsers,
	setMatches,
	setUrl,
	setUsersLikes,
} from '@/feature/interactions/store.slice';
import {
	useGetLikesQuery,
	useGetProfileQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useStoreSelector } from '@/hook/useStore';
import { selectAuth } from '@/feature/auth/store.slice';

// Type ------------------------------------------------------------------------
interface Props {
	accepted: 'AUTHENTICATED' | 'UNAUTHENTICATED';
	inverted?: boolean;
}

// Component -------------------------------------------------------------------
export default function ProtectedLayout({ accepted, inverted }: Props) {
	const isAuthenticated = localStorage.getItem('was_autenticated');
	const location_state = useLocation();
	const authStore = useStoreSelector(selectAuth);
	const dispatch = useDispatch();
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery(undefined, {
		skip:
			authStore.accessToken === null ||
			authStore.isProfileCompleted === true,
	});
	const {
		data: dataLikes = { likes: { by_me: [], to_me: [] } },
		isFetching: isFetchingLikes,
		isLoading: isLoadingLikes,
	} = useGetLikesQuery(undefined, { skip: authStore.accessToken === null });
	const [
		getProfile,
		// { isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		if (!(isFetchingLikes || isLoadingLikes)) {
			const likes = dataLikes.likes;

			const getLikedUsers = async () => {
				const matchesPromises = likes.by_me.map(async (like) => {
					try {
						const match = await getProfile({
							id: like.id_user_to,
						}).unwrap();
						return match;
					} catch (error) {
						// console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getLikedUsers().then((res) => {
				const liked_users = res.filter(notEmpty);
				const new_matches = liked_users.filter((user) =>
					likes.to_me
						.map((like) => like.id_user_from)
						.some((id) => user.id === id),
				);

				dispatch(setLikedUsers({ liked_users }));
				dispatch(setMatches({ matches: new_matches.filter(notEmpty) }));
			});

			dispatch(
				setUsersLikes({
					users_likes: likes.to_me.map((like) => like.id_user_from),
				}),
			);
		}
	}, [
		data,
		dispatch,
		getProfile,
		isFetchingLikes,
		isLoadingLikes,
		dataLikes.likes,
	]);

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

	if (accepted === 'AUTHENTICATED') {
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

	if (isError || location_state.pathname === '/auth/logout') {
		// toast.error(`Error: User not found`);
		return <Navigate to="/user/logout" />;
	}

	if (
		authStore.accessToken !== null &&
		authStore.isProfileCompleted === false
	) {
		if (
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
			Number(new URLSearchParams(location_state.search).get('page')) ??
			page;

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
