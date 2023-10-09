import BirthdayForm from '@/feature/auth/register/forms/birthdayForm';
import { useId, useState } from 'react';
import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import MatchaLogo from '/matcha.svg';
import GenderForm from '@/feature/auth/register/forms/genderForm';
import TagsForm from '@/feature/auth/register/forms/tagsForm';
import PicturesForm from '@/feature/auth/register/forms/picturesForm';

export type Profile = {
	birthday: Date;
	gender: string;
	pictures: string[];
	tags: string[];
};

type CompleteProfileError = {
	birthday: string[];
	gender: string[];
	tags: string[];
	pictures: string[];
};

export function Component() {
	const [profile, setProfile] = useState<Profile>({
		birthday: new Date(),
		gender: '',
		pictures: [],
		tags: [],
	});

	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as CompleteProfileError | undefined;

	return (
		<>
			<div className="flex justify-between flex-col items-center w-full">
				<Link to="/" className="flex justify-center">
					<img src={MatchaLogo} alt="MatchaLogo" className="w-1/3" />
				</Link>
				<div className="overflow-auto w-full h-full">
					<div className="flex justify-center my-4">
						<div className="flex flex-col justify-center items-center xs:w-1/2 md:w-1/3">
							<h4>
								Please complete your profile to start matching
								with people!
							</h4>
							<Form className="w-full">
								<BirthdayForm
									setProfile={setProfile}
									id={id}
									errors={data?.birthday}
								/>
								<GenderForm
									setProfile={setProfile}
									id={id}
									errors={data?.gender}
								/>
								<TagsForm
									setProfile={setProfile}
									id={id}
									errors={data?.tags}
								/>
								<PicturesForm
									setProfile={setProfile}
									id={id}
									errors={data?.pictures}
								/>
								<div className="flex justify-center mt-5">
									<button
										type="submit"
										className="group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 "
									>
										Save
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
