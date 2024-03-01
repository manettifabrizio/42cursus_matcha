import type { PayloadAction } from '@reduxjs/toolkit';
import { resetAll, type StoreState } from '@/core/store';
import { createSlice } from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State = {
	csrfToken: string | null;
};

const initialState: State = {
	csrfToken: null,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'security',
	initialState,
	extraReducers: (builder) => builder.addCase(resetAll, () => initialState),
	reducers: {
		setCsrfToken: (state, action: PayloadAction<State['csrfToken']>) => {
			state.csrfToken = action.payload;
		},
	},
});

// Action ----------------------------------------------------------------------
export const { setCsrfToken } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectSecurity = (state: StoreState) => state.security;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
