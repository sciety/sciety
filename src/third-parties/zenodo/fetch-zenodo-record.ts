import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as DE from '../../types/data-error';
import { htmlFragmentCodec } from '../../types/html-fragment';
import { Evaluation } from '../../types/evaluation';
import { GetJson } from '../../shared-ports';

const isDoiFromZenodo = (doi: string) => doi.startsWith('10.5281/');

const parseZenodoId = (zenodoDoi: string) => pipe(
  zenodoDoi.match(/10\.5281\/zenodo\.([0-9]+)/),
  O.fromNullable,
  O.chain(RA.lookup(1)),
);

const zenodoRecordCodec = t.type({
  metadata: t.type({
    description: htmlFragmentCodec,
  }),
});

type FetchZenodoRecord = (getJson: GetJson, logger: unknown)
=> (key: string)
=> TE.TaskEither<DE.DataError, Evaluation>;

export const fetchZenodoRecord: FetchZenodoRecord = (getJson) => (key) => pipe(
  key,
  E.fromPredicate(
    isDoiFromZenodo,
    () => DE.unavailable,
  ),
  E.chainOptionK(() => DE.unavailable)(parseZenodoId),
  TE.fromEither,
  TE.chain((zenodoId) => TE.tryCatch(
    async () => getJson(`https://zenodo.org/api/records/${zenodoId}`),
    () => DE.unavailable,
  )),
  TE.chainEitherKW(zenodoRecordCodec.decode),
  TE.bimap(
    () => DE.unavailable,
    (data) => data.metadata.description,
  ),
  TE.map((fullText) => ({
    fullText,
    url: new URL(`https://doi.org/${key}`),
  })),
);
