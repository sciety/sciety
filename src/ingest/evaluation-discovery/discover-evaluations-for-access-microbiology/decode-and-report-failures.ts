import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';

const toHumanFriendlyErrorMessage = (
  codecName: string,
) => (
  errors: t.Errors,
): string => pipe(
  errors,
  formatValidationErrors,
  (formattedErrors) => `acmi: could not decode crossref response, ${codecName} failed with: ${formattedErrors.join(', ')}`,
);

export const decodeAndReportFailures = <T>(
  codec: t.Decoder<unknown, T>,
) => (
    input: unknown,
  ): E.Either<string, T> => pipe(
    input,
    codec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage(codec.name)),
  );
