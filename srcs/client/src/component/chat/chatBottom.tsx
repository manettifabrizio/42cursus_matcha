import { sendMessage } from '@/feature/interactions/store.slice';
import { Profile } from '@/feature/user/types';
import { useStoreDispatch } from '@/hook/useStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

type ChatBottomProps = {
	other_user: Profile;
};

export default function ChatBottom({ other_user }: ChatBottomProps) {
	const [message, setMessage] = useState<string>('');
	const dispatch = useStoreDispatch();

	const checkMessage = (message: string) => {
		if (
			message.length > 0 &&
			message.trim().length > 0 &&
			message.length < 300
		) {
			return true;
		}

		toast.error('Message must be between 1 and 300 characters');

		return false;
	};

	return (
		<div className="pb-2 px-2">
			<form
				className="flex flex-row py-2 px-3 rounded-full w-full border"
				onSubmit={(e) => {
					e.preventDefault();
					if (!checkMessage(message)) return;
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
					placeholder="Type a message..."
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
