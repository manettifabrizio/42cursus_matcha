import { sendMessage } from '@/feature/interactions/store.slice';
import { Profile } from '@/feature/user/types';
import { useStoreDispatch } from '@/hook/useStore';
import { useState } from 'react';

type ChatBottomProps = {
	other_user: Profile;
};

export default function ChatBottom({ other_user }: ChatBottomProps) {
	const [message, setMessage] = useState<string>('');
	const dispatch = useStoreDispatch();

	return (
		<div className="pb-2 px-2">
			<form
				className="flex flex-row py-2 px-3 rounded-full w-full border"
				onSubmit={(e) => {
					e.preventDefault();
					dispatch(
						sendMessage({
							id_user: other_user.id,
							content: message,
						}),
					);
					setMessage('');
				}}
			>
				<input
					onChange={(e) => setMessage(e.target.value)}
					type="text"
                    placeholder='Type a message...'
					className="bg-transparent w-full flex input-no-style"
					value={message}
				/>
				<button className="ms-2" type="submit">
					Send
				</button>
			</form>
		</div>
	);
}
