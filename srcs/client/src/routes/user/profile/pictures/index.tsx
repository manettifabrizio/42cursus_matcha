import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import PicturesEdit from '@/component/user/profile/pictures/picturesEdit';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();

	if (!data) {
		toast.error(`Error: User not found`);
		return <Navigate to="/home" />;
	}

	return (
		<div className="flex justify-between flex-col items-center w-full h-full">
			<MatchaLogo to="/home" />
			<FormContainer size="sm">
				<div className="text-3xl mb-3 text-center w-full font-bold">
					Edit Pictures
				</div>
				<PicturesEdit
					profile={data}
					submitting={isFetching || isLoading}
				/>
			</FormContainer>
		</div>
	);
}
