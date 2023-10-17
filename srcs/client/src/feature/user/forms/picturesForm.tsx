import ImageSelector from '@/component/ui/imageSelector';
import { CompleteProfileError, Profile } from '@/page/user/complete-profile';

export type PicturesFormProps = {
    setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
	pictures: File[];
};

export default function PicturesForm(props: PicturesFormProps) {
	return (
		<div className='mb-5'>
			<h5 className='mb-1'>Upload at least 2 images to start</h5>
			<div className="flex justify-center items-center">
				<ImageSelector {...props} />
			</div>
		</div>
	);
}
