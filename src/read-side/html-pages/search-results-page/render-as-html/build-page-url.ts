import { pipe } from 'fp-ts/function';
import { searchResultsPagePath } from '../../../../standards/paths';

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
}) => `${searchResultsPagePath}?${renderQuery(query)}${renderEvaluatedOnly(evaluatedOnly)}`;
