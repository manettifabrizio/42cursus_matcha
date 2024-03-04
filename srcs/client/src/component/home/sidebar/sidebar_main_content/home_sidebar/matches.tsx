import MImage from '@/component/ui/mImage';
import { StoreState } from '@/core/store';
import { goToChat } from '@/feature/interactions/utils';
import { Profile } from '@/feature/user/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MatchesList() {
	const [displayedMatches, setDisplayedMatches] = useState<Profile[]>([]);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [scrollMax, setScrollMax] = useState(0);
	const listRef = useRef<HTMLUListElement>();
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);
	const messages = useSelector(
		(state: StoreState) => state.interactions.messages,
	);

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
		setDisplayedMatches(
			matches
				? matches.filter(
						(user) =>
							!messages[user.id] ||
							messages[user.id].length === 0,
				  )
				: [],
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
			<p className="font-bold mb-2 text-3xl">Your Matches</p>
			{displayedMatches.length === 0 ? (
				<div className="italic text-gray-500 text-sm mb-4">
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
									onClick={goToChat}
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
