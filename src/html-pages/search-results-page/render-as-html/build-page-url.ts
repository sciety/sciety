import { pipe } from 'fp-ts/function';

type UrlParams = {
  query: string,
  category: 'articles' | 'groups',
  evaluatedOnly: boolean,
};

const renderEvaluatedOnly = (evaluatedOnly: boolean) => (evaluatedOnly ? '&evaluatedOnly=true' : '');

const renderQuery = (query: string) => pipe(
  query,
  encodeURIComponent,
  (encoded) => `query=${encoded}`,
);

type BuildPageUrl = (urlParams: UrlParams) => string;

export const buildPageUrl: BuildPageUrl = ({
  query, category, evaluatedOnly,
}) => `/search?${renderQuery(query)}&category=${category}${renderEvaluatedOnly(evaluatedOnly)}`;
