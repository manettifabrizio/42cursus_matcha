import { useUserEditMutation } from '@/feature/user/api.slice';
import { CompleteProfileError } from '@/feature/user/types';
import { getGeolocation } from '@/tool/getLocation';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import toast from 'react-hot-toast';
import { TbMap } from 'react-icons/tb';

export default function LocationButton() {
	const [editUser] = useUserEditMutation();

	async function refreshLocation() {
		const toast_id = toast.loading('Refreshing location...');

		const location = await getGeolocation();

		try {
			editUser({ location }).unwrap();
			toast.success('Location refreshed!', { id: toast_id });
		} catch (error: unknown) {
			manageRTKQErrorDetails<CompleteProfileError>(error, toast_id);
		}
	}

	return (
		<div className="w-full mb-3">
			<button
				className="flex flex-row justify-center items-center w-full border rounded-3xl p-2"
				onClick={refreshLocation}
			>
				Refresh Location
				<TbMap className="text-xl ms-2" />
			</button>
		</div>
	);
}
