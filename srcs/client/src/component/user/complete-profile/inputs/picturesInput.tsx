import ImageSelector from '@/component/ui/imageSelector';
import { Picture, PicturesProfileError, Profile } from '@/feature/user/types';

export type PicturesInputProps = {
	setErrors: React.Dispatch<React.SetStateAction<PicturesProfileError>>;
	errors?: string[];
	base_pictures?: Picture[];
	profile_picture?: Picture;
	profile: Profile;
	loading: boolean;
};

export default function PicturesInput(props: PicturesInputProps) {
	return (
		<div className="mb-5 w-full">
			<h5 className="mb-1">Upload at least 2 images</h5>
			{props.base_pictures && props.base_pictures.length > 0 && (
				<h6 className="mb-1 opacity-70">
					Please select an image to be your profile picture
				</h6>
			)}

			<div
				id="complete-pictures-form"
				className="flex flex-col justify-center items-center"
			>
				<ImageSelector {...props} key={props.base_pictures?.length} />
			</div>
		</div>
	);
}
