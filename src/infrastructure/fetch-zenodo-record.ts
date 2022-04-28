import { URL } from 'url';
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
  TE.tryCatch(
    async () => getJson(key),
    () => DE.unavailable,
  ),
  TE.chainEitherKW(zenodoRecordCodec.decode),
  TE.bimap(
    () => DE.unavailable,
    (data) => data.metadata.description,
  ),
  TE.map((fullText) => ({
    fullText,
    url: new URL('https://sciety.org'),
  })),
);
