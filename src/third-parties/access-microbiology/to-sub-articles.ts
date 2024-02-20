/* eslint-disable @typescript-eslint/no-unused-vars */
import * as E from 'fp-ts/Either';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type SubArticle = {
  subArticleId: string,
  body: SanitisedHtmlFragment,
};

// ts-unused-exports:disable-next-line
export const toSubArticles = (input: unknown): E.Either<unknown, ReadonlyArray<SubArticle>> => E.right([]);
