import { Logger } from './logger';
import Doi from '../types/doi';
import { Json, JsonCompatible } from '../types/json';

type GetJson = (uri: string) => Promise<Json>;

interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
  postedDate: Date;
}

export type SearchEuropePmc = (query: string) => Promise<{
  items: Array<SearchResult>;
  total: number;
}>;

type EuropePmcQueryResponse = JsonCompatible<{
  hitCount: number;
  resultList: {
    result: Array<{
      doi: string;
      title: string;
      authorString: string;
      firstPublicationDate: string;
    }>;
  };
}>;

export default (getJson: GetJson, logger: Logger): SearchEuropePmc => (
  async (query) => {
    const uri = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
      + `?query=${query}%20PUBLISHER%3A%22bioRxiv%22%20sort_date%3Ay&format=json&pageSize=10`;
    const data = await getJson(uri) as EuropePmcQueryResponse;

    logger('debug', 'Received Europe PMC search results', { data });

    const items = data.resultList.result.map((item): SearchResult => ({
      doi: new Doi(item.doi),
      title: item.title,
      authors: item.authorString,
      postedDate: new Date(item.firstPublicationDate),
    }));

    return {
      items,
      total: data.hitCount,
    };
  }
);
