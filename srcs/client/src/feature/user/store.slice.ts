import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { clearAuth } from '@/feature/auth/store.slice';

// State -----------------------------------------------------------------------
type State = {
    id: number | null;
    firstname: string | null;
    lastname: string | null;
};

const initialState: State = {
    id: null,
    firstname: null,
    lastname: null
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<State>) => {
            state.id = payload.id;
            state.firstname = payload.firstname;
            state.lastname = payload.lastname;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(clearAuth, (state) => {
            // Todo: Avoid duplicate with initialState
            state.id = null;
            state.firstname = null;
            state.lastname = null;
        });
    }
});

// Action ----------------------------------------------------------------------
export const { setUser } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectUser = (state: StoreState) => state.user;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
