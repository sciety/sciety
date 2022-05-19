import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Evaluation } from './evaluation';
import * as DE from '../types/data-error';
import { htmlFragmentCodec } from '../types/html-fragment';

type GetJson = (uri: string) => Promise<Json>;

const isDoiFromZenodo = (doi: string) => doi.startsWith('10.5281/');

const parseZenodoId = (zenodoDoi: string) => pipe(
  zenodoDoi.match(/10\.5281\/zenodo\.([0-9]+)/),
  E.fromNullable(DE.unavailable),
  E.map(RA.lookup(1)),
  E.chain(E.fromOption(() => DE.unavailable)),
);

const zenodoRecordCodec = t.type({
  metadata: t.type({
    description: htmlFragmentCodec,
  }),
});

type FetchZenodoRecord = (getJson: GetJson, logger: unknown)
=> (key: string)
=> TE.TaskEither<DE.DataError, Evaluation>;
// ts-unused-exports:disable-next-line
export const fetchZenodoRecord: FetchZenodoRecord = (getJson) => (key) => pipe(
  key,
  E.fromPredicate(
    isDoiFromZenodo,
    () => DE.unavailable,
  ),
  E.chain(parseZenodoId),
  TE.fromEither,
  TE.chain((zenodoId) => TE.tryCatch(
    async () => pipe(
      zenodoId,
      async (cleanKey) => getJson(`https://zenodo.org/api/records/${cleanKey}`),
    ),
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
