import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Dependencies } from '../discover-published-evaluations';

const determinePagesToSelectCodec = t.strict({
  message: t.strict({
    'total-results': t.number,
  }),
});

const toHumanFriendlyErrorMessage = (
  errors: t.Errors,
) => pipe(
  errors,
  formatValidationErrors,
  (formattedErrors) => `acmi: could not decode crossref response to determine pages to select ${formattedErrors.join(', ')}`,
);

export type SelectedPage = { rows: number, offset: number };

export const determinePagesToSelect = (pageSize: number) => (
  dependencies: Dependencies,
): TE.TaskEither<string, ReadonlyArray<SelectedPage>> => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of',
  dependencies.fetchData,
  TE.chainEitherK(flow(
    determinePagesToSelectCodec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage),
  )),
  TE.map(({ message }) => (message['total-results'] === 0
    ? []
    : [
      { rows: pageSize, offset: 0 },
      { rows: pageSize, offset: 1000 },
    ])),
);
