import LoadingSpinner from '@/component/ui/loadingSpinner';
import {
	useGetLikesQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Matches() {
	const [matches, setMatches] = useState<Profile[]>([]);
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

			const matches_ids = likes.by_me
				.map((like_by_me) =>
					likes.to_me.filter(
						(like_to_me) =>
							like_to_me.id_user_from === like_by_me.id_user_to,
					),
				)
				.filter((match) => match.length > 0)
				.map((match) => match[0].id_user_from);

			const getMatches = async () => {
				const matchesPromises = matches_ids.map(async (id) => {
					try {
						const match = await getProfile({ id }).unwrap();
						return match;
					} catch (error) {
						console.error(error);
						return null;
					}
				});

				return Promise.all(matchesPromises);
			};

			getMatches().then((matches) => {
				console.log(matches);
				setMatches(matches.filter(notEmpty));
			});
		}
	}, [data]);

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
			) : (matches.length === 0 ? (
				<div className='italic text-gray-500 text-sm'>Start discovering people to get matches.</div>
			) : (
				<ul className="flex list-none p-0 flex-row">
					{matches.map((match) => (
						<li
							className="grid auto-rows-auto auto-cols-max gap-3 h-12 w-12 relative"
							key={match.id}
						>
							<Link
								to="#"
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
			))}
		</div>
	);
}
