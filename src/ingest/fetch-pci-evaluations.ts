import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DOMParser } from 'xmldom';
import { FetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';

type Ports = {
  fetchData: FetchData,
};

export const fetchPciEvaluations = (url: string): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(url),
  TE.map((feed) => {
    const parser = new DOMParser({
      errorHandler: (_, msg) => {
        throw msg;
      },
    });
    const doc = parser.parseFromString(feed, 'text/xml');
    const result = [];
    // eslint-disable-next-line no-loops/no-loops
    for (const link of Array.from(doc.getElementsByTagName('link'))) {
      const articleDoiString = link.getElementsByTagName('doi')[1]?.textContent ?? '';
      const reviewDoiString = link.getElementsByTagName('doi')[0]?.textContent ?? '';
      const date = link.getElementsByTagName('date')[0]?.textContent ?? '';
      const bioAndmedrxivDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.1101\/(?:[^%"#?\s])+)\s*$/;
      const [, articleDoi] = bioAndmedrxivDoiRegex.exec(articleDoiString) ?? [];
      if (articleDoi) {
        const reviewDoi = reviewDoiString.replace('https://doi.org/', '').replace('http://dx.doi.org/', '');
        result.push({
          date: new Date(date),
          articleDoi,
          evaluationLocator: `doi:${reviewDoi}`,
        });
      }
    }
    return result;
  }),
);
