import type { StoreState } from '@/core/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { clearAuth } from '@/feature/auth/store.slice';
import { Profile, initProfile } from './types';
import { formatDateTimeShort } from '@/tool/userTools';

// State -----------------------------------------------------------------------
type State = Profile;

// Slice -----------------------------------------------------------------------
const slice = createSlice({
	name: 'user',
	initialState: initProfile,
	reducers: {
		setUser: (state, { payload }: PayloadAction<State>) => {
			state.id = payload.id;
			state.email = payload.email;
			state.last_seen_at = payload.last_seen_at;
			state.birthdate = formatDateTimeShort(payload.birthdate);
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
			state.likes = payload.likes;
			state.blocks = payload.blocks;
			state.reports = payload.reports;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(clearAuth, (state) => {
			state = initProfile;
		});
	},
});

// Action ----------------------------------------------------------------------
export const { setUser } = slice.actions;

// Selector --------------------------------------------------------------------
export const selectUser = (state: StoreState) => state.user;

// Reducer ---------------------------------------------------------------------
export default slice.reducer;
