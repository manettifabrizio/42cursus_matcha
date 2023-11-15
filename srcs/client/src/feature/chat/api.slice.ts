import { api } from '@/core/api';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { Message } from './types';
import { cookie } from '@/tool/cookie';

const messagesAdapter = createEntityAdapter<Message>();

// Type ------------------------------------------------------------------------
type GetMessagesRequest = {
	to_id: number;
};

type GetMessagesResponse = Message[];

// Api -------------------------------------------------------------------------
export const chatApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query<EntityState<Message>, GetMessagesRequest>({
			query: (body) => `messages/${body.to_id}`,
			transformResponse(response: Message[]) {
				return messagesAdapter.addMany(
					messagesAdapter.getInitialState(),
					response,
				);
			},
			async onCacheEntryAdded(
				arg,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved },
			) {
				const ws = io('https://localhost', {
					withCredentials: true,
					auth: {
						token: cookie('access-token'),
					},
				});
				try {
					await cacheDataLoaded;

					const listener = (event: MessageEvent) => {
						const data: Message = JSON.parse(event.data);
						if (data.to_id !== arg.to_id) return;

						updateCachedData((draft) => {
							console.log('message: ', data);
							messagesAdapter.upsertOne(draft, data);
						});
					};

					ws.on('message', listener);
				} catch {}
				await cacheEntryRemoved;
				ws.close();
			},
		}),
	}),
});

// Hook ------------------------------------------------------------------------
export const { useGetMessagesQuery } = chatApi;
