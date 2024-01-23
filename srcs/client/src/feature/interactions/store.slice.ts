import { type StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Message, Notification } from './types';
import { Profile } from '../user/types';
import {
	likeToast,
	matchToast,
	messageToast,
	unlikeToast,
	viewToast,
} from '@/component/ui/customToasts';
import { createNotification } from './notificationsContent';

// State -----------------------------------------------------------------------
type State = {
	userId: number;
	isEstablishingConnection: boolean;
	isConnected: boolean;
	messages: Record<number, Message[]>;
	// TODO: Maybe remove matches, could be done only with liked users
	// the only critical usecase is ReceiveLike
	matches: Profile[];
	liked_users: Profile[];
	user_status: boolean | Date | undefined;
	notifications: Notification[];
	notifications_opened: boolean;
};

const initialState: State = {
	userId: -1,
	isEstablishingConnection: false,
	isConnected: false,
	messages: {},
	liked_users: [],
	matches: [],
	user_status: undefined,
	notifications: [],
	notifications_opened: false,
};

export type addNotificationType = typeof slice.caseReducers.addNotification;

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'interactions',
	initialState,
	reducers: {
		setUserId: (state, action: PayloadAction<number>) => {
			return { ...state, userId: action.payload };
		},
		startConnecting: (state) => {
			state.isEstablishingConnection = true;
		},
		startDisconnecting: () => {},
		connectionEstablished: (state) => {
			state.isConnected = true;
			state.isEstablishingConnection = true;
		},
		isUserOnline: (
			_,
			_action: PayloadAction<{
				id_user: number;
			}>,
		) => {},
		setUserOnline: (
			state,
			action: PayloadAction<{
				id_user: number;
				online: boolean | Date;
			}>,
		) => {
			return { ...state, user_status: action.payload.online };
		},
		viewProfile: (
			_,
			_action: PayloadAction<{
				id_user: number;
			}>,
		) => {},
		profileViewed: (
			state,
			action: PayloadAction<{
				id_user_from: number;
				username: string;
			}>,
		) => {
			const username = action.payload.username;
			const userId = action.payload.id_user_from;

			viewToast(username, userId);

			// TODO: Emit from server only when user that view profile is online
			return {
				...state,
				notifications: [
					...state.notifications,
					createNotification(
						state.notifications.length,
						'view',
						username,
						userId,
						state.notifications_opened,
					),
				],
			};
		},
		resetIsUserOnline: (state) => {
			return { ...state, user_status: undefined };
		},
		sendMessage: (
			_,
			_action: PayloadAction<{
				id_user?: number;
				content: string;
			}>,
		) => {
			return;
		},
		getMessages: (
			_,
			_action: PayloadAction<{
				id_user?: number;
				page: number;
			}>,
		) => {},
		receiveAllMessages: (
			state,
			action: PayloadAction<{
				id_user: number;
				messages: Message[];
			}>,
		) => {
			const { id_user: id_other_user, messages } = action.payload;

			const chat_id: number = id_other_user;

			const existingUserMessages: Message[] =
				state.messages[chat_id] || [];

			console.log('existingUserMessages', existingUserMessages);

			const unseen_messages = messages.map((message) => ({
				...message,
				seen: false,
			}));

			console.log('unseen_messages', unseen_messages);

			// Remove duplicates
			const updatedUserMessages = Array.from(
				new Map(
					[...existingUserMessages, ...unseen_messages].map((msg) => [
						msg.id,
						msg,
					]),
				).values(),
			);

			return {
				...state,
				messages: {
					...state.messages,
					[chat_id]: updatedUserMessages,
				},
			};
		},
		receiveMessage: (state, action: PayloadAction<Message>) => {
			const { id_user_from, id_user_to } = action.payload;

			const chat_id: number =
				id_user_from === state.userId ? id_user_to : id_user_from;

			const existingUserMessages = state.messages[chat_id] || [];

			const updatedUserMessages = [
				...existingUserMessages,
				action.payload,
			];

			const other_user = state.matches.find(
				(user) => user.id === id_user_from,
			);

			if (id_user_from === other_user?.id)
				messageToast(
					other_user?.firstname ?? 'unknown',
					action.payload.id_user_from,
					action.payload.content,
					other_user?.picture?.path ?? '',
				);

			return {
				...state,
				messages: {
					...state.messages,
					[chat_id]: updatedUserMessages,
				},
			};
		},
		setLikedUsers: (
			state,
			action: PayloadAction<{
				liked_users: Profile[];
			}>,
		) => {
			return { ...state, liked_users: action.payload.liked_users };
		},
		setMatches: (
			state,
			action: PayloadAction<{
				matches: Profile[];
			}>,
		) => {
			return { ...state, matches: action.payload.matches };
		},
		addLikedUser: (
			state,
			action: PayloadAction<{
				liked_user: Profile;
			}>,
		) => {
			if (
				state.liked_users.some(
					(user) => user.id !== action.payload.liked_user.id,
				)
			)
				return {
					...state,
					liked_users: [
						...state.liked_users,
						action.payload.liked_user,
					],
				};
		},
		rmLikedUser: (
			state,
			action: PayloadAction<{
				unliked_user_id: number;
			}>,
		) => {
			return {
				...state,
				liked_users: state.liked_users.filter(
					(user) => user.id !== action.payload.unliked_user_id,
				),
			};
		},
		receiveLike: (
			state,
			action: PayloadAction<{
				id_user_from: number;
				username: string;
			}>,
		) => {
			const { id_user_from, username } = action.payload;

			const matched_user = state.liked_users.find(
				(user) => user.id === id_user_from,
			);

			if (matched_user) {
				if (matched_user.firstname)
					matchToast(matched_user.firstname, matched_user.id);
				else {
					matchToast('unknown', matched_user.id);
					console.error('Match user firstname is undefined');
				}
				return {
					...state,
					notifications: [
						...state.notifications,
						createNotification(
							state.notifications.length,
							'match',
							matched_user.firstname ?? 'unknown',
							id_user_from,
							state.notifications_opened,
						),
					],
					matches: [...state.matches, matched_user],
					messages: {
						[matched_user.id]: [],
					},
				};
			} else {
				likeToast(username, id_user_from);

				return {
					...state,
					notifications: [
						...state.notifications,
						createNotification(
							state.notifications.length,
							'like',
							username,
							id_user_from,
							state.notifications_opened,
						),
					],
				};
			}
		},
		receiveUnlike: (
			state,
			action: PayloadAction<{
				id_user_from: number;
				username: string;
			}>,
		) => {
			const userId = action.payload.id_user_from;
			const username = action.payload.username;

			if (
				state.matches.some(
					(user) => user.id === action.payload.id_user_from,
				)
			) {
				unlikeToast(username, userId);

				const updatedMessages = state.messages;

				delete updatedMessages[userId];

				console.log('unlikeMessages', Object.entries(updatedMessages));

				return {
					...state,
					notifications: [
						...state.notifications,
						createNotification(
							state.notifications.length,
							'unlike',
							username,
							userId,
							state.notifications_opened,
						),
					],
					matches: state.matches.filter((user) => user.id !== userId),
					messages: updatedMessages,
				};
			}
		},
		toggleNotifications: (state) => {
			return {
				...state,
				notifications_opened: !state.notifications_opened,
			};
		},
		addNotification: (state, { payload }: PayloadAction<Notification>) => {
			return {
				...state,
				notifications: [...state.notifications, payload],
			};
		},
		rmNotification: (state, { payload }: PayloadAction<number>) => {
			return {
				...state,
				notifications: state.notifications.filter(
					(notification) => notification.id !== payload,
				),
			};
		},
		readNotifications: (state) => {
			return {
				...state,
				notifications: state.notifications.map((notification) => {
					return { ...notification, seen: true };
				}),
			};
		},
	},
});

// Action ----------------------------------------------------------------------
export const {
	setUserId,
	startConnecting,
	connectionEstablished,
	startDisconnecting,
	viewProfile,
	profileViewed,
	getMessages,
	receiveAllMessages,
	receiveMessage,
	sendMessage,
	isUserOnline,
	setUserOnline,
	resetIsUserOnline,
	setMatches,
	setLikedUsers,
	receiveLike,
	receiveUnlike,
	addLikedUser,
	rmLikedUser,
	toggleNotifications,
	addNotification,
	rmNotification,
	readNotifications,
} = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
