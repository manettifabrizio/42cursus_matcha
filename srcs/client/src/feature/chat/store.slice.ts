import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Message } from './types';

// State -----------------------------------------------------------------------
type State = {
	isEstablishingConnection: boolean;
	isConnected: boolean;
	messages: Message[];
	matches: number[];
	is_user_online: boolean | undefined;
};

const initialState: State = {
	isEstablishingConnection: false,
	isConnected: false,
	messages: [],
	matches: [],
	is_user_online: undefined,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		startConnecting: (state) => {
			console.log('startConnecting');
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
				user: number;
			}>,
		) => {},
		setUserOnline: (
			state,
			action: PayloadAction<{
				user: number;
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
				user: number;
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
		likeUser: () => {},
		unlikeUser: () => {},
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
} = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
