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
		withCredentials: true,
		auth: {
			token: cookie('access-token'),
		},
	});
	if (ws) {
		ws.emit('message:to', { content: 'ciao mamma', to: 1 }, (res) => {
            console.log('message_sent: ', res);
        });
		console.log('message_sent: ', message);

        ws.on('error', function (err) {
            console.log(err);
        });

		ws.close();
	} else {
		console.error("Couldn't connect to the websocket");
	}
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
