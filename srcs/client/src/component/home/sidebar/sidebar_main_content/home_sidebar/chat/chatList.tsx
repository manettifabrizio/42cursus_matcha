import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import Chat from './chat';

export default function ChatsList() {
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	return (
		<div className="flex-1 overflow-y-auto w-full">
			<p className="font-bold mb-2 text-3xl">Conversations</p>
			<ul className="list-none p-0 w-full">
				{matches
					? matches.map((match) => (
							<Chat key={match.id} user={match} />
					  ))
					: null}
			</ul>
		</div>
	);
}
