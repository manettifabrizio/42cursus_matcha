import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '@/feature/auth/rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	id: number;
	email: string;
};

type ValidationOuput =
	ValidationInput
;

// Function --------------------------------------------------------------------
export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkIdNotEmpty(),
		Rules.checkEmail(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
