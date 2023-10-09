import ImageSelector from '@/component/ui/imageUpload';
import { Profile } from '@/page/user/complete-profile';

type PicturesFormProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

export default function PicturesForm({
	id,
	errors,
	setProfile,
}: PicturesFormProps) {
	return (
		<>
			<h5>Upload at least 2 images to start</h5>
			<div className="flex justify-center items-center">
				<ImageSelector
					id={id}
					errors={errors}
					setProfile={setProfile}
				/>
			</div>
		</>
	);
}
