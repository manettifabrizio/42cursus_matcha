import { Link } from 'react-router-dom';
import { Notification, NotificationType } from './types';
import { getTimeElapsedString } from '@/tool/interactionsTools';

export function createNotification(
	id: number,
	type: NotificationType,
	firstname: string,
	userId: number,
	seen = false,
): Notification {
	return {
		id,
		createdAt: new Date().toISOString(),
		firstname,
		userId,
		type,
		seen,
	};
}

export function chooseNotificationContent(
	type: string,
	firstname: string,
	id_user: number,
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
					to={`${location.origin}/home/${id_user}`}
					className="underline font-bold"
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
					to={`${location.origin}/home/${id_user}`}
					className="underline font-bold"
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
					to={`${location.origin}/home/${id_user}`}
					className="underline font-bold"
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
					to={`${location.origin}/home/${id_user}`}
					className="underline font-bold"
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
