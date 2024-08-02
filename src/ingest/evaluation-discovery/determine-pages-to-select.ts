import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { crossrefWorksApiUrlFilteredForMicrobiologySociety } from './crossref-works-api-filtered-for-microbiology-society-url';
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

const constructSelectedPage = (totalResults: number, pageSize: number) => {
  const numberOfPagesToSelect = Math.ceil(totalResults / pageSize);
  return pipe(
    RNEA.range(0, numberOfPagesToSelect - 1),
    RNEA.map((offsetIndex) => ({
      rows: pageSize, offset: offsetIndex * pageSize,
    })),
  );
};

export type SelectedPage = { rows: number, offset: number };

export const determinePagesToSelect = (pageSize: number) => (
  dependencies: Dependencies,
): TE.TaskEither<string, ReadonlyArray<SelectedPage>> => pipe(
  crossrefWorksApiUrlFilteredForMicrobiologySociety.toString(),
  dependencies.fetchData,
  TE.chainEitherK(flow(
    determinePagesToSelectCodec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage),
  )),
  TE.map(({ message }) => (message['total-results'] === 0
    ? []
    : constructSelectedPage(message['total-results'], pageSize))),
);
