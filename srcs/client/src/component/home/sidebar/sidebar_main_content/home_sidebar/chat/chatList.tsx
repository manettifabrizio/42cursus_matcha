import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import Chat from './chat';
import { URLType } from '@/feature/types';

type ChatsListProps = {
	setUrl: React.Dispatch<React.SetStateAction<URLType>>;
};

export default function ChatsList({ setUrl }: ChatsListProps) {
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	return (
		<div className="flex-1 overflow-y-auto w-full">
			<p className="font-bold mb-2 text-3xl">Conversations</p>
			<ul className="list-none p-0 w-full">
				{matches.map((match) => (
					<Chat key={match.id} user={match} setUrl={setUrl} />
				))}
			</ul>
		</div>
	);
}
