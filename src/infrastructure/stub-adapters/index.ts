import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { SearchResults } from '../../third-parties/europe-pmc';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
  searchEuropePmc: () => (): TE.TaskEither<DE.DataError, SearchResults> => TE.right({
    items: [
      {
        articleId: new Doi('10.1101/2022.12.15.520598'),
        server: 'biorxiv' as const,
        title: pipe(
          'Mapping current and future thermal limits to suitability for malaria transmission by the invasive mosquito <i>Anopheles stephens</i> i',
          toHtmlFragment,
          sanitise,
        ),
        authors: O.some([
          'Sadie J. Ryan',
          'Catherine A. Lippi',
          'Oswaldo C. Villena',
          'Aspen Singh',
          'Courtney C. Murdock',
          'Leah R. Johnson',
        ]),
      },
      {
        articleId: new Doi('10.1101/123457'),
        server: 'medrxiv' as const,
        title: pipe('Lorem ipsum all over again', toHtmlFragment, sanitise),
        authors: O.some(['Fred Bloggs', 'Amy Bloggs']),
      },
    ],
    total: 2,
    nextCursor: O.none,
  }),
};
