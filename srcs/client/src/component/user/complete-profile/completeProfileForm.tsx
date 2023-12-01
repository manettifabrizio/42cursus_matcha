import BiographyInput from './inputs/biographyInputs';
import BirthdayInput from './inputs/birthdayInput';
import GenderInput from './inputs/genderInput';
import OrientationInput from './inputs/orientationInput';
import PicturesInput from './inputs/picturesInput';
import TagsInput from './inputs/tagsInput';
import { CompleteProfileError, CompleteProfile } from '@/feature/user/types';

type CompleteProfileProps = {
	submitting: boolean;
	setProfile: React.Dispatch<React.SetStateAction<CompleteProfile>>;
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>;
	id: string;
	errors: CompleteProfileError;
	profile: CompleteProfile;
	complete?: boolean;
};

export default function CompleteProfileForm({
	submitting,
	setProfile,
	setErrors,
	id,
	errors,
	profile,
	complete = true,
}: CompleteProfileProps) {
	return (
		<>
			{complete && (
				<BirthdayInput
					disabled={submitting}
					setProfile={setProfile}
					id={id}
					errors={errors?.birthdate}
					profile={profile}
				/>
			)}
			<GenderInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.gender}
				profile={profile}
			/>
			<OrientationInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.orientation}
				profile={profile}
			/>
			<BiographyInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.biography}
				profile={profile}
			/>
			<TagsInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.tags}
				profile={profile}
			/>
			<PicturesInput
				disabled={submitting}
				setErrors={setErrors}
				setProfile={setProfile}
				errors={errors?.pictures}
				pictures={profile.pictures}
			/>
			<div className="flex justify-center mt-5">
				<button
					disabled={submitting}
					type="submit"
					className={
						'group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 border border-black hover:opacity-80 transition ' +
						(submitting ? 'opacity-80' : '')
					}
				>
					{submitting ? 'Submitting...' : 'Save'}
				</button>
			</div>
		</>
	);
}
