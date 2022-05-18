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
    (doi) => doi.startsWith('10.5281/'),
    () => DE.unavailable,
  ),
  () => TE.tryCatch(
    async () => {
      if (key.startsWith('10.5281/')) {
        const cleanKey = key.split('.')[2];

        return getJson(`https://zenodo.org/api/records/${cleanKey}`);
      }
      throw new Error();
    },
    () => DE.unavailable,
  ),
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
