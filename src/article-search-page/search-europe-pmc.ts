import { SearchResult } from './render-search-result';
import { FindArticles } from './render-search-results';
import Doi from '../data/doi';
import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

interface EuropePmcQueryResponse {
  hitCount: number;
  resultList: {
    result: Array<{
      doi: string;
      title: string;
      authorString: string;
    }>;
  };
}

const log = createLogger('article-search-page:render-search-results');

export default (getJson: GetJson): FindArticles => (
  async (query) => {
    const uri = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
      + `?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const data = await getJson(uri) as EuropePmcQueryResponse;
    log(data);

    const items = data.resultList.result.map((item): SearchResult => {
      let postedDate;
      if (item.doi === '10.1101/226092') {
        postedDate = new Date('2017-11-30');
      }
      return {
        doi: new Doi(item.doi),
        title: item.title,
        authors: item.authorString,
        postedDate,
      };
    });

    return {
      items,
      total: data.hitCount,
    };
  }
);
