import { pipe } from 'fp-ts/function';

type UrlParams = {
  query: string,
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
  query, evaluatedOnly,
}) => `/search?${renderQuery(query)}${renderEvaluatedOnly(evaluatedOnly)}`;
