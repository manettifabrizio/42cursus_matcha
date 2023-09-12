import type { StoreState }    from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice }        from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State =
{
	accessToken: string|null;
}

const initialState: State =
{
	accessToken: null,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice(
{
	name: 'auth',
	initialState,
	reducers:
	{
		setAccessToken: (state, action: PayloadAction<State['accessToken']>) =>
		{
			state.accessToken = action.payload;
		},
		reset: () => initialState,
	},
});

// Action ----------------------------------------------------------------------
export const {
	setAccessToken,
	reset,
} = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
