import LabelInput from '@/component/ui/labelInput';
import { CompleteProfile, CompleteProfileError } from '@/feature/user/types';
import { useId } from 'react';

type AccountFormProps = {
	profile: CompleteProfile;
	errors: CompleteProfileError;
};

export default function AccountForm({ profile, errors }: AccountFormProps) {
	const id = useId();

	return (
		<>
			<div className="mb-5 w-full">
				<h5 className="mb-1">Firstname</h5>
				<LabelInput
					input_props={{
						required: true,
						type: 'text',
						name: 'firstname',
						placeholder: 'First Name',
						id: `${id}-firstname`,
						value: profile.firstname,
					}}
					errors={errors?.firstname}
				/>
			</div>
			<div className="mb-5 w-full">
				<h5 className="mb-1">Lastname</h5>
				<LabelInput
					input_props={{
						required: true,
						type: 'text',
						name: 'lastname',
						placeholder: 'Last Name',
						id: `${id}-lastname`,
						value: profile.lastname,
					}}
					errors={errors?.lastname}
				/>
			</div>
			<div className="mb-5 w-full">
				<h5 className="mb-1">Email</h5>
				<LabelInput
					input_props={{
						required: true,
						type: 'email',
						name: 'email',
						placeholder: 'Email',
						id: `${id}-email`,
						value: profile.email,
					}}
					errors={errors?.email}
				/>
			</div>
		</>
	);
}
