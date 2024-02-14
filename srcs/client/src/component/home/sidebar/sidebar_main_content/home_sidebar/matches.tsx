import LoadingSpinner from '@/component/ui/loadingSpinner';
import MImage from '@/component/ui/mImage';
import { StoreState } from '@/core/store';
import { setLikedUsers, setMatches } from '@/feature/interactions/store.slice';
import {
	useGetLikesQuery,
	useLazyGetProfileQuery,
} from '@/feature/user/api.slice';
import { Profile } from '@/feature/user/types';
import { notEmpty } from '@/tool/userTools';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MatchesList() {
	const [displayedMatches, setDisplayedMatches] = useState<Profile[]>([]);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [scrollMax, setScrollMax] = useState(0);
	const listRef = useRef<HTMLUListElement>();
	const dispatch = useDispatch();
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);
	const messages = useSelector(
		(state: StoreState) => state.interactions.messages,
	);
	const {
		data = { likes: { by_me: [], to_me: [] } },
		isFetching: isFetchingLikes,
		isLoading: isLoadingLikes,
	} = useGetLikesQuery();
	const [
		getProfile,
		{ isLoading: isLoadingProfiles, isFetching: isFetchingProfiles },
	] = useLazyGetProfileQuery();

	const handleList = useCallback((node: HTMLUListElement) => {
		const handleScroll = () => {
			if (node) {
				const currentPosition = node.scrollLeft;
				setScrollPosition(currentPosition);
			}
		};

		if (node) {
			node.addEventListener('scroll', handleScroll);
			setScrollMax(node.scrollWidth - node.clientWidth);
		}

		return () => {
			if (node) {
				node.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

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
				const new_matches = liked_users.filter((user) =>
					likes.to_me
						.map((like) => like.id_user_from)
						.some((id) => user.id === id),
				);

				dispatch(setLikedUsers({ liked_users }));
				dispatch(setMatches({ matches: new_matches.filter(notEmpty) }));
			});
		}
	}, [data, dispatch, getProfile, isFetchingLikes, isLoadingLikes]);

	useEffect(() => {
		setDisplayedMatches(
			matches.filter(
				(user) => !messages[user.id] || messages[user.id].length === 0,
			),
		);
	}, [matches, messages]);

	const scrollToRight = () => {
		if (listRef.current && scrollPosition < scrollMax) {
			if (scrollPosition <= scrollMax) {
				const newScrollPosition = scrollPosition + 100; // Adjust the value as needed
				listRef.current.scrollLeft = newScrollPosition;
				setScrollPosition(newScrollPosition);
			}
		}
	};

	const scrollToLeft = () => {
		if (listRef.current && scrollPosition > 0) {
			const newScrollPosition = scrollPosition - 100; // Adjust the value as needed
			listRef.current.scrollLeft = newScrollPosition;
			setScrollPosition(newScrollPosition);
		}
	};

	return (
		<div className="flex flex-col">
			<p className="font-bold mb-2 text-2xl">Your Matches</p>
			{isFetchingLikes ||
			isLoadingLikes ||
			isLoadingProfiles ||
			isFetchingProfiles ? (
				<div className="w-full flex justify-center items-center">
					<LoadingSpinner size="sm" />
				</div>
			) : displayedMatches.length === 0 ? (
				<div className="italic text-gray-500 text-sm mb-2">
					Start discovering people to get matches.
				</div>
			) : (
				<div className="relative">
					<ul
						className="flex overflow-x-auto h-14 flex-row gap-3 no-scrollbar relative scroll-smooth"
						ref={(el) => {
							if (el) {
								handleList(el);
								listRef.current = el;
							}
						}}
					>
						{displayedMatches.map((match) => (
							<li className="flex h-12 w-12" key={match.id}>
								<Link
									to={`/chat/${match.id}`}
									className="user-match relative items-center h-12 w-12"
								>
									<MImage
										src={`${match.picture?.path}`}
										alt="Avatar"
										className="absolute inset-0 h-12 w-12 object-cover rounded-full border border-black"
									/>
								</Link>
							</li>
						))}
					</ul>
					{scrollPosition < scrollMax && (
						<button
							className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 text-black"
							onClick={scrollToRight}
						>
							<FaChevronRight />
						</button>
					)}
					{scrollPosition > 0 && (
						<button
							className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 text-black"
							onClick={scrollToLeft}
						>
							<FaChevronLeft />
						</button>
					)}
				</div>
			)}
		</div>
	);
}
