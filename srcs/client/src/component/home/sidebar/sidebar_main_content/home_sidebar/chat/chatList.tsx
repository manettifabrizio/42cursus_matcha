import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import Chat from './chat';

export default function ChatsList() {
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	return (
		<div className="flex-1 overflow-auto">
			<p className="font-bold mb-2 text-2xl">Conversations</p>
			<ul className="list-none p-0">
				{matches.map((match) => (
					<Chat key={match.id} user={match} />
				))}
			</ul>
		</div>
	);
}
