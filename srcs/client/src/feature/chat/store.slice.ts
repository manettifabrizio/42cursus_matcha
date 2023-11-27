import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Message } from './types';
import { Profile } from '../user/types';
import {
	likeToast,
	matchToast,
	unlikeToast,
} from '@/component/ui/customToasts';
import toast from 'react-hot-toast';

// State -----------------------------------------------------------------------
type State = {
	isEstablishingConnection: boolean;
	isConnected: boolean;
	messages: Message[];
	// TODO: Maybe remove matches, could be done only with liked users
	// the only critical usecase is ReceiveLike
	matches: Profile[];
	liked_users: Profile[];
	user_status: boolean | Date | undefined;
};

const initialState: State = {
	isEstablishingConnection: false,
	isConnected: false,
	messages: [],
	liked_users: [],
	matches: [],
	user_status: undefined,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
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
		profileViewed: (
			_,
			action: PayloadAction<{
				id_user_from: number;
			}>,
		) => {
			// TODO: Emit from server only when user that view profile is online
			toast(
				'Someone viewed your profile!' + action.payload.id_user_from,
				{ icon: '👀' },
			);
		},
		resetIsUserOnline: (state) => {
			return { ...state, user_status: undefined };
		},
		sendMessage: (
			_,
			_action: PayloadAction<{
				id_user: number;
				content: string;
			}>,
		) => {
			return;
		},
		receiveAllMessages: (
			state,
			action: PayloadAction<{
				messages: Message[];
			}>,
		) => {
			state.messages = action.payload.messages;
		},
		receiveMessage: (
			state,
			action: PayloadAction<{
				message: Message;
			}>,
		) => {
			state.messages.push(action.payload.message);
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
			}>,
		) => {
			const matched_user = state.liked_users.find(
				(user) => user.id === action.payload.id_user_from,
			);

			if (matched_user) {
				matchToast(matched_user.firstname, matched_user.id);
				return {
					...state,
					matches: [...state.matches, matched_user],
				};
			} else {
				likeToast('username', action.payload.id_user_from);
			}
		},
		receiveUnlike: (
			state,
			action: PayloadAction<{
				id_user_from: number;
			}>,
		) => {
			if (
				state.matches.some(
					(user) => user.id === action.payload.id_user_from,
				)
			) {
				unlikeToast('mamma');
				return {
					...state,
					matches: state.matches.filter(
						(user) => user.id !== action.payload.id_user_from,
					),
				};
			}
		},
	},
});

// Action ----------------------------------------------------------------------
export const {
	startConnecting,
	connectionEstablished,
	startDisconnecting,
	profileViewed,
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
} = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
