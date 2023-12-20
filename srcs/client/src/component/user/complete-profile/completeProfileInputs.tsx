import LabelInput from '@/component/ui/labelInput';
import BiographyInput from './inputs/biographyInputs';
import BirthdayInput from './inputs/birthdayInput';
import GenderInput from './inputs/genderInput';
import OrientationInput from './inputs/orientationInput';
import TagsInput from './inputs/tagsInput';
import { CompleteProfileError, CompleteProfile } from '@/feature/user/types';
import { hasProfileChanged, hasTagsChanged } from '@/feature/user/utils';

type CompleteProfileProps = {
	submitting: boolean;
	setProfile: React.Dispatch<React.SetStateAction<CompleteProfile>>;
	id: string;
	errors: CompleteProfileError;
	profile: CompleteProfile;
	base_profile?: CompleteProfile;
};

export default function CompleteProfileForm({
	submitting,
	setProfile,
	id,
	errors,
	profile,
	base_profile = undefined,
}: CompleteProfileProps) {
	function hasSomethingChanged(profile: CompleteProfile): boolean {
		return (
			base_profile == undefined ||
			hasProfileChanged(profile, base_profile) ||
			hasTagsChanged(profile.tags, base_profile.tags)
		);
	}

	return (
		<>
			{base_profile && (
				<>
					<LabelInput
						title={true}
						input_props={{
							name: 'firstname',
							placeholder: 'Firstname',
							id: `${id}-firstname`,
							value: profile.firstname,
							onChange: (e) =>
								setProfile((current) => ({
									...current,
									firstname: e.target.value,
								})),
						}}
						errors_props={errors.firstname}
					/>
					<LabelInput
						title={true}
						input_props={{
							name: 'lastname',
							placeholder: 'Lastname',
							id: `${id}-lastname`,
							value: profile.lastname,
							onChange: (e) =>
								setProfile((current) => ({
									...current,
									lastname: e.target.value,
								})),
						}}
						errors_props={errors.lastname}
					/>
				</>
			)}
			{/* The birthay can be set only at registration */}
			{!base_profile && (
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
				profile={profile}
			/>
			<OrientationInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				profile={profile}
			/>
			<TagsInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.tags}
				profile={profile}
			/>
			<BiographyInput
				disabled={submitting}
				setProfile={setProfile}
				id={id}
				errors={errors?.biography}
				profile={profile}
			/>
			<div className="flex justify-center mt-5">
				<button
					disabled={submitting || !hasSomethingChanged(profile)}
					type="submit"
					className={
						'group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 border border-black hover:opacity-80 transition ' +
						(submitting || !hasSomethingChanged(profile)
							? 'opacity-80'
							: '')
					}
				>
					{submitting
						? 'Submitting...'
						: base_profile
						? 'Save'
						: 'Next'}
				</button>
			</div>
		</>
	);
}
