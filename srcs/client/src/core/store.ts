import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/core/api';
import authReducers from '@/feature/auth/store.slice';
import userReducers from '@/feature/user/store.slice';
import securityReducers from '@/feature/security/store.slice';
import chatReducers from '@/feature/chat/store.slice';

// Store -----------------------------------------------------------------------
export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth: authReducers,
		user: userReducers,
		security: securityReducers,
		chat: chatReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

// Type ------------------------------------------------------------------------
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
