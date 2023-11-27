import ImageSelector from '@/component/ui/imageSelector';
import { CompleteProfile, CompleteProfileError } from '@/feature/user/types';

export type PicturesInputProps = {
	disabled: boolean;
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<CompleteProfile>>;
	pictures: File[];
};

export default function PicturesInput(props: PicturesInputProps) {
	return (
		<div className="mb-5">
			<h5 className="mb-1">Upload at least 2 images to start</h5>
			<div className="flex justify-center items-center">
				<ImageSelector {...props} />
			</div>
		</div>
	);
}
