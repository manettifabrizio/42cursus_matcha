import { Override }          from '@/core/typing';
import { ValidationService } from '@/core/validation/types';
import * as Rules            from '@/module/auth/rules';


type ValidationInput =
{
	id: string;
	secret: string;
};

type ValidationOuput =
	Override<ValidationInput, { id: number }>
;

export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkIdNotEmpty(),
		Rules.checkSecretNotEmpty(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
