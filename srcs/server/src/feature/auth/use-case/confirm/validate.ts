import type { Override }          from '@/core/typing';
import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '@/feature/auth/rules';

// Type ------------------------------------------------------------------------
type ValidationInput =
{
	id: string;
	secret: string;
};

type ValidationOuput =
	Override<ValidationInput, { id: number }>
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
		Rules.checkSecretNotEmpty(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
