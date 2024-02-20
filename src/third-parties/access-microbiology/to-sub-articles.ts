import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { identity, pipe } from 'fp-ts/function';
import { XMLParser } from 'fast-xml-parser';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';

const parser = new XMLParser({});

export type SubArticle = {
  subArticleId: string,
  body: SanitisedHtmlFragment,
};

const parseXmlDocument = (s: string) => E.tryCatch(
  () => parser.parse(s) as unknown,
  identity,
);

export const toSubArticles = (input: unknown): E.Either<unknown, ReadonlyArray<SubArticle>> => pipe(
  input,
  t.string.decode,
  E.chainW(parseXmlDocument),
  E.map(() => [{ subArticleId: '', body: sanitise(toHtmlFragment('')) }]),
);
