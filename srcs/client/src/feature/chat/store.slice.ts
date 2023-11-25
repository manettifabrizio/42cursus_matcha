import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, current } from '@reduxjs/toolkit';
import { Message } from './types';
import { Profile } from '../user/types';
import { toast } from 'react-toastify';

// State -----------------------------------------------------------------------
type State = {
	isEstablishingConnection: boolean;
	isConnected: boolean;
	messages: Message[];
    // TODO: Maybe remove matches, could be done only with liked users
    // the only critical usecase is ReceiveLike
	matches: Profile[];
	liked_users: Profile[];
	is_user_online: boolean | undefined;
};

const initialState: State = {
	isEstablishingConnection: false,
	isConnected: false,
	messages: [],
	liked_users: [],
	matches: [],
	is_user_online: undefined,
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
				is_online: boolean;
			}>,
		) => {
			return { ...state, is_user_online: action.payload.is_online };
		},
		resetIsUserOnline: (state) => {
			return { ...state, is_user_online: undefined };
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
				toast(`You matched with ${matched_user.firstname}!`);
				return {
					...state,
					matches: [...state.matches, matched_user],
				};
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
			)
				return {
					...state,
					matches: state.matches.filter(
						(user) => user.id !== action.payload.id_user_from,
					),
				};
		},
	},
});

// Action ----------------------------------------------------------------------
export const {
	startConnecting,
	connectionEstablished,
	startDisconnecting,
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
