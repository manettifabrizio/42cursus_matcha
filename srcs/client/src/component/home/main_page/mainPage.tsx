import { User } from '@/feature/user/types';
import { store } from '@/core/store';
import AvailableUsers from './availableUsers';
import { useState } from 'react';
import MatchaLogo from '@/component/ui/matchaLogo';
import SearchAndFilter from './users_filter/searchAndFIlter';

export default function MainPage() {
	const [searchValue, setSearchValue] = useState('');
	const actualUser = store.getState().user;

	const users: User[] = [
		actualUser,
		actualUser,
		actualUser,
		actualUser,
		actualUser,
		actualUser,
		actualUser,
		actualUser,
		actualUser,
	];

	return (
		<div className="ml-72 h-full">
			<div className="flex justify-between flex-col w-full h-full">
				<MatchaLogo to="/home" />
				<SearchAndFilter
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
				<AvailableUsers
					users={users.filter((u) =>
						u.firstname.toLowerCase().includes(searchValue),
					)}
				/>
			</div>
		</div>
	);
}
