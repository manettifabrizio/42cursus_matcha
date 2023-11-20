import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Message } from './types';
import { io } from 'socket.io-client';
import { cookie } from '@/tool/cookie';

// State -----------------------------------------------------------------------
type State = {
	messages: Message[];
};

const initialState: State = {
	messages: [],
};

const sendMessageToUser = (message: Message) => {
	const ws = io('https://localhost', {
		auth: {
			token: cookie('access-token'),
		},
	});

	ws.emit('ping', 5002); // Target user id
	ws.on('pong', (isOnline) => console.log(`isOnline: ${isOnline}`));

	ws.emit('message:to', { content: 'ciao mamma', to: 1 });
	ws.on('message:from', (msg) => console.log(`message:from: ${msg}`));
	ws.on('message:error', (err) => console.error(`message:error: ${err}`));

	ws.on('error', console.error);

	// Just to avoid creating infite number of sockets while testing
	setTimeout(() => {
		ws.close();
	}, 2000);
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		sendMessage: (state, { payload }: PayloadAction<Message>) => {
			console.log('sendMessage');
			const messages = state.messages;
			sendMessageToUser(payload);
			state.messages = [...messages, payload];
		},
	},
});

// Action ----------------------------------------------------------------------
export const { sendMessage } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
