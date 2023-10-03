import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// State -----------------------------------------------------------------------
type State = {
    accessToken: string | null;
};

const initialState: State = {
    accessToken: null
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthAccessToken: (
            state,
            action: PayloadAction<State['accessToken']>
        ) => {
            state.accessToken = action.payload;
        },
        clearAuth: () => initialState // Todo: Verify if it works
    }
});

// Action ----------------------------------------------------------------------
export const { setAuthAccessToken, clearAuth } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectAuth = (state: StoreState) => state.auth;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
