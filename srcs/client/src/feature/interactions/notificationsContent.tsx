import { Link } from 'react-router-dom';
import { Notification, NotificationType } from './types';
import { getTimeElapsedString } from '@/tool/interactionsTools';
import MImage from '@/component/ui/mImage';
import { goToProfile } from './utils';

export function createNotification(
	id: number,
	type: NotificationType,
	firstname: string,
	userId: number,
	seen = false,
	userPicture?: string,
	messageContent?: string,
): Notification {
	return {
		id,
		createdAt: new Date().toISOString(),
		firstname,
		userId,
		type,
		seen,
		userPicture,
		messageContent,
	};
}

export function chooseNotificationContent(
	type: string,
	firstname: string,
	id_user: number,
	message_content?: string,
	picture?: string,
	created_at?: string,
) {
	switch (type) {
		case 'view':
			return viewContent(firstname, id_user, created_at);
		case 'like':
			return likeContent(firstname, id_user, created_at);
		case 'unlike':
			return unlikeContent(firstname, id_user, created_at);
		case 'match':
			return matchContent(firstname, id_user, created_at);
		case 'message':
			return messageContent(
				firstname,
				id_user,
				message_content,
				picture,
				created_at,
			);
		default:
			return null;
	}
}

function viewContent(firstname: string, id_user: number, created_at?: string) {
	return (
		<>
			<div className="text-2xl pe-3">👀</div>
			<div>
				<Link
					to={`${location.origin}/user/${id_user}`}
					className="underline font-bold"
					onClick={() => goToProfile()}
				>
					{firstname}
				</Link>{' '}
				viewed your profile
				<div className="text-xs opacity-70">
					{created_at && getTimeElapsedString(created_at)}
				</div>
			</div>
		</>
	);
}

function likeContent(firstname: string, id_user: number, created_at?: string) {
	return (
		<>
			<div className="text-2xl pe-3">❤️‍🔥</div>
			<div>
				You received a like from{' '}
				<Link
					to={`${location.origin}/user/${id_user}`}
					className="underline font-bold"
					onClick={() => goToProfile()}
				>
					{firstname}
				</Link>
				<div className="text-xs opacity-70">
					{created_at && getTimeElapsedString(created_at)}
				</div>
			</div>
		</>
	);
}

function unlikeContent(
	firstname: string,
	id_user: number,
	created_at?: string,
) {
	return (
		<>
			<div className="text-2xl pe-3">💔</div>
			<div>
				<Link
					to={`${location.origin}/user/${id_user}`}
					className="underline font-bold"
					onClick={() => goToProfile()}
				>
					{firstname}
				</Link>{' '}
				unliked you
				<div className="text-xs opacity-70">
					{created_at && getTimeElapsedString(created_at)}
				</div>
			</div>
		</>
	);
}

function matchContent(firstname: string, id_user: number, created_at?: string) {
	return (
		<>
			<div className="text-2xl pe-3">🔥</div>
			<div>
				You matched with{' '}
				<Link
					to={`${location.origin}/user/${id_user}`}
					className="underline font-bold"
					onClick={() => goToProfile()}
				>
					{firstname}
				</Link>
				<div className="text-xs opacity-70">
					{created_at && getTimeElapsedString(created_at)}
				</div>
			</div>
		</>
	);
}

function messageContent(
	firstname: string,
	id_user: number,
	content?: string,
	picture?: string,
	created_at?: string,
) {
	return (
		<div className="w-full flex flex-row">
			<div className="text-2xl pe-2 w-[3.5rem]">
				<MImage
					src={`${picture}`}
					alt="Avatar"
					className="inset-0 h-12 w-12 object-cover rounded-full"
				/>
			</div>
			<div className="flex-1 flex-col min-w-0">
				<div>
					<div>
						<Link
							to={`${location.origin}/chat/${id_user}`}
							className="underline font-bold"
							onClick={() => goToProfile()}
						>
							{firstname}
						</Link>{' '}
						sent you a message
					</div>
					<div className="text-xs opacity-70">
						{created_at && getTimeElapsedString(created_at)}
					</div>
				</div>
				<div className="text-xs opacity-70 overflow-hidden text-ellipsis whitespace-nowrap">
					{content}
				</div>
			</div>
		</div>
	);
}
