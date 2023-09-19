import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '@/feature/user/rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	id: number;
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
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
