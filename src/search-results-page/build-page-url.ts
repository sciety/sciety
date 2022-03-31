type UrlParams = {
  query: string,
  category: 'articles' | 'groups',
  evaluatedOnly: boolean,
};

type BuildPageUrl = (urlParams: UrlParams) => string;

export const buildPageUrl: BuildPageUrl = ({ query, category, evaluatedOnly }) => `/search?query=${encodeURIComponent(query)}&category=${category}${evaluatedOnly ? '&evaluatedOnly=true' : ''}`;
