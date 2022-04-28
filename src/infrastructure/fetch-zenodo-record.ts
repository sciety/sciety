import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { Evaluation } from './evaluation';
import { toHtmlFragment } from '../types/html-fragment';

type FetchZenodoRecord = (getJson: unknown, logger: unknown) => (key: string) => T.Task<Evaluation>;
// ts-unused-exports:disable-next-line
export const fetchZenodoRecord: FetchZenodoRecord = () => () => T.of({ fullText: toHtmlFragment(''), url: new URL('') });
