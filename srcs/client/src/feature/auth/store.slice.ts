import { resetAll, type StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State = {
	accessToken: string | null;
};

const initialState: State = {
	accessToken: null,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'auth',
	initialState,
	extraReducers: (builder) => builder.addCase(resetAll, () => initialState),
	reducers: {
		setAuthAccessToken: (
			state,
			action: PayloadAction<State['accessToken']>,
		) => {
			state.accessToken = action.payload;
			localStorage.setItem('is_authenticated', JSON.stringify(true));
		},
		clearAuth: () => {
			// is_authenticated is set to false when user logs out, and is null when user is not authenticated
			localStorage.setItem('is_authenticated', JSON.stringify(false));
		},
	},
});

// Action ----------------------------------------------------------------------
export const { setAuthAccessToken, clearAuth } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
