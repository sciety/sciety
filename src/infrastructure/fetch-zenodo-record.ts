import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Evaluation } from './evaluation';
import * as DE from '../types/data-error';
import { htmlFragmentCodec } from '../types/html-fragment';

type GetJson = (uri: string) => Promise<Json>;

const isDoiFromZenodo = (doi: string) => doi.startsWith('10.5281/');

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
  TE.fromEither,
  TE.chain((doi) => TE.tryCatch(
    async () => {
      const cleanKey = doi.split('.')[2];
      if (cleanKey) {
        return getJson(`https://zenodo.org/api/records/${cleanKey}`);
      }
      throw new Error();
    },
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
