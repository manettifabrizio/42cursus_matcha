import { configureStore, createAction } from '@reduxjs/toolkit';
import { api } from '@/core/api';
import authReducers from '@/feature/auth/store.slice';
// import securityReducers from '@/feature/security/store.slice';
import interactionsReducers from '@/feature/interactions/store.slice';
import chatMiddleware from '@/feature/interactions/middleware';

// Reset store state
export const resetAll = createAction('resetAll');

// Store -----------------------------------------------------------------------
export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth: authReducers,
		interactions: interactionsReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([api.middleware, chatMiddleware]),
});

// Type ------------------------------------------------------------------------
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
