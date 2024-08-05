import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { getCrossrefWorksApiUrlFilteredForMicrobiologySociety } from './get-crossref-works-api-filtered-for-microbiology-society-url';
import { toHumanFriendlyErrorMessage } from './to-human-friendly-error-message';
import { Dependencies } from '../../discover-published-evaluations';

const determinePagesToSelectCodec = t.strict({
  message: t.strict({
    'total-results': t.number,
  }),
}, 'determinePagesToSelectCodec');

const constructSelectedPage = (totalResults: number, pageSize: number) => {
  const numberOfPagesToSelect = Math.ceil(totalResults / pageSize);
  return pipe(
    RNEA.range(0, numberOfPagesToSelect - 1),
    RNEA.map((offsetIndex) => ({
      offset: offsetIndex * pageSize,
    })),
  );
};

export type SelectedPage = { offset: number };

export const determinePagesToSelect = (pageSize: number) => (
  dependencies: Dependencies,
): TE.TaskEither<string, ReadonlyArray<SelectedPage>> => pipe(
  getCrossrefWorksApiUrlFilteredForMicrobiologySociety().href,
  dependencies.fetchData,
  TE.chainEitherK(flow(
    determinePagesToSelectCodec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage(determinePagesToSelectCodec.name)),
  )),
  TE.map(({ message }) => (message['total-results'] === 0
    ? []
    : constructSelectedPage(message['total-results'], pageSize))),
);
