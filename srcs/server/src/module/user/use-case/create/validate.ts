import { ValidationService } from '@/core/validation/types';
import * as Rules            from '@/module/user/rules';


type ValidationInput =
{
	id: number;
	firstname: string;
	lastname: string;
};

type ValidationOuput =
	ValidationInput
;

export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkId(),
		Rules.checkFirstname(),
		Rules.checkLastname(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
