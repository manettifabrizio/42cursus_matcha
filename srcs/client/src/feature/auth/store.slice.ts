import { resetAll, type StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State = {
	accessToken: string | null;
	isProfileCompleted: boolean;
};

const initialState: State = {
	accessToken: null,
	isProfileCompleted: false,
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
			localStorage.setItem('was_autenticated', JSON.stringify(true));
		},
		setProfileCompleted: (
			state,
			action: PayloadAction<State['isProfileCompleted']>,
		) => {
			state.isProfileCompleted = action.payload;
		},
		clearAuth: () => {
			// was_autenticated is set to false when user logs out, and is null when user is not authenticated
			localStorage.setItem('was_autenticated', JSON.stringify(false));
			localStorage.removeItem('is_completed');
		},
	},
});

// Action ----------------------------------------------------------------------
export const { setAuthAccessToken, setProfileCompleted, clearAuth } =
	slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
