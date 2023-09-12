import type { PayloadAction } from '@reduxjs/toolkit';
import type { StoreState }    from '@/core/store';
import { createSlice }        from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State =
{
	csrfToken: string|null;
}

const initialState: State =
{
	csrfToken: null,
};

// Slice -----------------------------------------------------------------------
const slice = createSlice(
{
	name: 'security',
	initialState,
	reducers:
	{
		setCsrfToken: (state, action: PayloadAction<State['csrfToken']>) =>
		{
			state.csrfToken = action.payload;
		},
	},
});

// Action ----------------------------------------------------------------------
export const {
	setCsrfToken,
} = slice.actions;

// Selector --------------------------------------------------------------------
export const selectSecurity = (state: StoreState) => state.security;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
