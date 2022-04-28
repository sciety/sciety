import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Evaluation } from './evaluation';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';

type FetchZenodoRecord = (getJson: unknown, logger: unknown)
=> (key: string)
=> TE.TaskEither<DE.DataError, Evaluation>;
// ts-unused-exports:disable-next-line
export const fetchZenodoRecord: FetchZenodoRecord = () => () => T.of(E.right({ fullText: toHtmlFragment(''), url: new URL('') }));
