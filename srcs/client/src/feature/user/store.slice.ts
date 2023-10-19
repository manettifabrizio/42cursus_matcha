import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { clearAuth } from '@/feature/auth/store.slice';
import { User } from './types';

// State -----------------------------------------------------------------------
type State = User;

const initialState: State = {
	id: -1,
	username: '',
	firstname: '',
	lastname: '',
	gender: 'MALE',
	orientation: 'BISEXUAL',
	biography: '',
	location: null,
	tags: [],
	picture: null,
	pictures: [],
};

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, { payload }: PayloadAction<State>) => {
			state.id = payload.id;
			state.username = payload.username;
			state.firstname = payload.firstname;
			state.lastname = payload.lastname;
			state.gender = payload.gender;
			state.orientation = payload.orientation;
			state.biography = payload.biography;
			state.location = payload.location;
			state.tags = payload.tags;
			state.picture = payload.picture;
			state.pictures = payload.pictures;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(clearAuth, (state) => {
			state = initialState;
		});
	},
});

// Action ----------------------------------------------------------------------
export const { setUser } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectUser = (state: StoreState) => state.user;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
