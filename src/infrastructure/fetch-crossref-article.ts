import { Result } from 'true-myth';
import { DOMParser } from 'xmldom';
import { Logger } from './logger';
import Doi from '../types/doi';

type FetchCrossrefArticleError = 'not-found' | 'unavailable';

export type FetchCrossrefArticle = (doi: Doi) => Promise<Result<{
  abstract: string;
  authors: Array<string>;
  doi: Doi;
  title: string;
  publicationDate: Date;
}, FetchCrossrefArticleError>>;

export type MakeHttpRequest = (uri: string, acceptHeader: string) => Promise<string>;

export default (makeHttpRequest: MakeHttpRequest, logger: Logger): FetchCrossrefArticle => {
  const getElement = (ancestor: Document | Element, qualifiedName: string): Element | null => (
    ancestor.getElementsByTagName(qualifiedName).item(0)
  );

  const getAbstract = (doc: Document, doi: Doi): string => {
    const abstractElement = getElement(doc, 'abstract');

    if (typeof abstractElement?.textContent !== 'string') {
      logger('warn', 'Did not find abstract', { doi });

      return `No abstract for ${doi} available`;
    }

    logger('debug', 'Found abstract', { doi, abstract: abstractElement.textContent });

    const titleElement = getElement(abstractElement, 'title');
    if (titleElement) {
      abstractElement.removeChild(titleElement);
    }

    return `${abstractElement}`
      .replace(/<abstract[^>]*>/, '')
      .replace(/<\/abstract>/, '')
      .replace(/<italic[^>]*>/g, '<i>')
      .replace(/<\/italic>/g, '</i>')
      .replace(/<list[^>]* list-type=['"]bullet['"][^>]*/g, '<ul')
      .replace(/<\/list>/g, '</ul>')
      .replace(/<list-item[^>]*/g, '<li')
      .replace(/<\/list-item>/g, '</li>')
      .replace(/<sec[^>]*/g, '<section')
      .replace(/<\/sec>/g, '</section>')
      .replace(/<title[^>]*/g, '<h3 class="ui header"')
      .replace(/<\/title>/g, '</h3>');
  };

  const getAuthors = (doc: Document, doi: Doi): Array<string> => {
    const contributorsElement = getElement(doc, 'contributors');

    if (!contributorsElement || typeof contributorsElement?.textContent !== 'string') {
      logger('debug', 'Did not find contributors', { doi });
      return [];
    }

    return Array.from(contributorsElement.getElementsByTagName('person_name'))
      .filter((person) => person.getAttribute('contributor_role') === 'author')
      .map((person) => {
        const givenName = person.getElementsByTagName('given_name')[0]?.textContent;
        const surname = person.getElementsByTagName('surname')[0].textContent ?? 'Unknown author';

        if (!givenName) {
          return surname;
        }

        return `${givenName} ${surname}`;
      });
  };

  const getTitle = (doc: Document): string => {
    const titlesElement = getElement(doc, 'titles');
    const titleElement = titlesElement?.getElementsByTagName('title')[0];
    return titleElement?.textContent ?? 'Unknown title';
  };

  const getPublicationDate = (doc: Document): Date => {
    const postedDateElement = getElement(doc, 'posted_date');

    const postedDateYear = postedDateElement?.getElementsByTagName('year')[0];
    const year = postedDateYear?.textContent ?? '1970';

    const postedDateMonth = postedDateElement?.getElementsByTagName('month')[0];
    const month = postedDateMonth?.textContent ?? '01';

    const postedDateDay = postedDateElement?.getElementsByTagName('day')[0];
    const day = postedDateDay?.textContent ?? '01';

    return new Date(`${year}-${month}-${day}`);
  };

  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });

  return async (doi) => {
    const uri = `https://doi.org/${doi.value}`;
    logger('debug', 'Fetching Crossref article', { uri });

    let response: string;
    try {
      response = await makeHttpRequest(uri, 'application/vnd.crossref.unixref+xml');
    } catch (error) {
      logger('error', 'Failed to fetch article', { doi, error });

      return Result.err('not-found');
    }

    try {
      const doc = parser.parseFromString(response, 'text/xml');
      return Result.ok({
        abstract: getAbstract(doc, doi),
        authors: getAuthors(doc, doi),
        doi,
        title: getTitle(doc),
        publicationDate: getPublicationDate(doc),
      });
    } catch (error) {
      logger('error', 'Unable to parse document', { doi, response, error });

      return Result.err('unavailable');
    }
  };
};
