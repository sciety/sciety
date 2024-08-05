import { URL } from 'url';

export const getCrossrefWorksApiUrlFilteredForMicrobiologySociety = (): URL => {
  const queryUrl = new URL('https://api.crossref.org/works');
  queryUrl.searchParams.set('filter', 'prefix:10.1099,type:peer-review,relation.type:is-review-of');
  return queryUrl;
};
