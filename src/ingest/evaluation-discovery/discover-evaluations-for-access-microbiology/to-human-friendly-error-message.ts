import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';

export const toHumanFriendlyErrorMessage = (
  codecName: string,
) => (
  errors: t.Errors,
): string => pipe(
  errors,
  formatValidationErrors,
  (formattedErrors) => `acmi: could not decode crossref response, ${codecName} failed with: ${formattedErrors.join(', ')}`,
);
