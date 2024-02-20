import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { XMLParser } from 'fast-xml-parser';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';

const parser = new XMLParser({});

export type SubArticle = {
  subArticleId: string,
  body: SanitisedHtmlFragment,
};

export const toSubArticles = (input: unknown): E.Either<unknown, ReadonlyArray<SubArticle>> => pipe(
  input,
  t.string.decode,
  E.map((s) => parser.parse(s) as unknown),
  E.map(() => [{ subArticleId: '', body: sanitise(toHtmlFragment('')) }]),
);
