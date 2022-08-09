import * as T from 'fp-ts/Task';
import { HtmlFragment } from './html-fragment';

export type PageAsPartials = {
  title: T.Task<string>,
  first: T.Task<HtmlFragment>,
  second: T.Task<HtmlFragment>,
};
