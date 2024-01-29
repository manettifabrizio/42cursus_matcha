import LoadingSpinner from '@/component/ui/loadingSpinner';
import { StoreState } from '@/core/store';
import { setLikedUsers, setMatches } from '@/feature/interactions/store.slice';
import {
	useGetLikesQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { notEmpty } from '@/tool/userTools';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MatchesList() {
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);
	const dispatch = useDispatch();
	const {
		data = { likes: { by_me: [], to_me: [] } },
		isFetching: isFetchingLikes,
		isLoading: isLoadingLikes,
	} = useGetLikesQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	useEffect(() => {
		if (!(isFetchingLikes || isLoadingLikes)) {
			const likes = data.likes;

			const getLikedUsers = async () => {
				const matchesPromises = likes.by_me.map(async (like) => {
					try {
						const match = await getProfile({
							id: like.id_user_to,
						}).unwrap();
						return match;
					} catch (error) {
						console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getLikedUsers().then((res) => {
				const liked_users = res.filter(notEmpty);
				const matches = liked_users.filter((user) =>
					likes.to_me
						.map((like) => like.id_user_from)
						.some((id) => user.id === id),
				);

				dispatch(setLikedUsers({ liked_users }));
				dispatch(setMatches({ matches: matches.filter(notEmpty) }));
			});
		}
	}, [data, dispatch, getProfile, isFetchingLikes, isLoadingLikes]);

	return (
		<div className="mb-4 flex flex-col">
			<p className="font-bold mb-2 text-2xl">Your Matches</p>
			{isFetchingLikes ||
			isLoadingLikes ||
			isLoadingProfiles ||
			isFetchingProfiles ? (
				<div className="w-full flex justify-center items-center">
					<LoadingSpinner size="sm" />
				</div>
			) : matches.length === 0 ? (
				<div className="italic text-gray-500 text-sm">
					Start discovering people to get matches.
				</div>
			) : (
				<ul className="flex list-none p-0 flex-row">
					{matches.map((match) => (
						<li
							className="grid auto-rows-auto auto-cols-max gap-3 h-12 w-12 relative"
							key={match.id}
						>
							<Link
								to={`/chat/${match.id}`}
								className="user-match relative items-center h-12 w-12"
							>
								<img
									src={`${location.origin}/api/pictures/${match.picture?.path}`}
									alt="Match"
									className="absolute inset-0 h-12 w-12 object-cover rounded-full border border-black"
								/>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
