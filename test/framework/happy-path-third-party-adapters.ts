import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { FetchArticle } from '../../src/shared-ports';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryString } from '../helpers';
import { ArticleServer } from '../../src/types/article-server';

export type HappyPathThirdPartyAdapters = {
  fetchArticle: FetchArticle,
};

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
});
