import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MatchaLogo from '@/component/ui/matchaLogo';
import { readMessages } from '@/feature/interactions/store.slice';
import { StoreState } from '@/core/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useStoreDispatch } from '@/hook/useStore';
import ChatTop from '@/component/chat/chatTop';
import ChatMainContent from '@/component/chat/chatMainContent';
import ChatBottom from '@/component/chat/chatBottom';

export function Component() {
	const { id } = useParams<{ id: string }>();
	const dispatch = useStoreDispatch();
	const navigate = useNavigate();
	const matches = useSelector(
		(state: StoreState) => state.interactions.matches,
	);

	const id_other_user = id ? parseInt(id) : undefined;

	const {
		data: Profile = undefined,
		isFetching,
		isLoading,
	} = useGetProfileQuery({ id: id_other_user });

	const messages = useSelector((state: StoreState) =>
		id_other_user ? state.interactions.messages[id_other_user] : [],
	);

	useEffect(() => {
		if (id_other_user && messages) {
			dispatch(readMessages(id_other_user));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, id_other_user]);

	useEffect(() => {
		if (
			!id_other_user ||
			(matches &&
				matches.filter((match) => match.id === id_other_user).length ===
					0)
		) {
			navigate('/home');
		}
	}, [matches, navigate, id_other_user]);

	if (isLoading || isFetching) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Loading User" />
			</div>
		);
	}

	if (!Profile) {
		toast.error(`Error: User n.${id} not found`);
		return <Navigate to="/home" />;
	}

	if (!messages)
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Loading Messages" />
			</div>
		);

	const other_user = Profile;

	return (
		<div className="flex flex-col w-full h-full">
			<MatchaLogo to="/home" />
			<ChatTop user={other_user} />
			<ChatMainContent other_user={other_user} messages={messages} />
			<ChatBottom other_user={other_user} />
		</div>
	);
}
