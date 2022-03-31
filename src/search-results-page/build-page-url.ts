import { htmlEscape } from 'escape-goat';

type UrlParams = {
  query: string,
  category: string,
  evaluatedOnly: boolean,
};

type BuildPageUrl = (urlParams: UrlParams) => string;

export const buildPageUrl: BuildPageUrl = ({ query, category, evaluatedOnly }) => `/search?query=${htmlEscape(query)}&category=${category}${evaluatedOnly ? '&evaluatedOnly=true' : ''}`;
