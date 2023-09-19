import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '@/feature/user/rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	id: number;
	firstname: string;
	lastname: string;
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
		Rules.checkId(),
		Rules.checkFirstname(),
		Rules.checkLastname(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
