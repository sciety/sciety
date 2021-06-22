import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { match } from 'ts-pattern';
import { XMLSerializer } from 'xmldom';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

const getElement = (ancestor: Document | Element, qualifiedName: string) => (
  ancestor.getElementsByTagName(qualifiedName).item(0)
);

export const getAbstract = (doc: Document, doi: Doi, logger: Logger): SanitisedHtmlFragment => {
  const abstractElement = getElement(doc, 'abstract');

  if (typeof abstractElement?.textContent !== 'string') {
    logger('warn', 'Did not find abstract', { doi });

    return pipe(
      `No abstract for ${doi.value} available`,
      toHtmlFragment,
      sanitise,
    );
  }

  logger('debug', 'Found abstract', { doi, abstract: abstractElement.textContent });

  const titleElement = getElement(abstractElement, 'title');
  if (titleElement) {
    abstractElement.removeChild(titleElement);
  }

  const titles = Array.from(abstractElement.getElementsByTagName('title'));
  titles.forEach((title) => {
    if (title.textContent === 'Graphical abstract') {
      abstractElement.removeChild(title);
    }
  });

  const abstract = new XMLSerializer().serializeToString(abstractElement);

  const transformXmlToHtml = (xml: string) => (
    xml
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
      .replace(/<title[^>]*/g, '<h3')
      .replace(/<\/title>/g, '</h3>')
  );

  const stripEmptySections = (html: string) => (
    html.replace(/<section>\s*<\/section>/g, '')
  );

  return pipe(
    abstract,
    transformXmlToHtml,
    toHtmlFragment,
    sanitise,
    stripEmptySections,
    toHtmlFragment,
    sanitise,
  );
};

export const getTitle = (doc: Document, doi: Doi, logger: Logger): SanitisedHtmlFragment => {
  const titlesElement = getElement(doc, 'titles');
  const titleElement = titlesElement?.getElementsByTagName('title')[0];
  let title = 'Unknown title';
  // TODO: the decision as to what to display on error should live with the rendering component
  if (titleElement) {
    title = new XMLSerializer()
      .serializeToString(titleElement)
      .replace(/^<title(?:.?)>([\s\S]*)<\/title>$/, '$1');
  } else {
    logger('warn', 'Did not find title', { doi });
  }

  return pipe(
    title,
    toHtmlFragment,
    sanitise,
  );
};

export const getServer = flow(
  (doc: Document) => {
    const doiDataElement = getElement(doc, 'doi_data');
    const resourceElement = doiDataElement?.getElementsByTagName('resource')[0];
    return resourceElement?.textContent;
  },
  O.fromNullable,
  O.filter((resource) => resource.includes('://medrxiv.org')),
  O.fold(
    constant('biorxiv' as const),
    constant('medrxiv' as const),
  ),
);

const personAuthor = (person: Element) => {
  const givenName = person.getElementsByTagName('given_name')[0]?.textContent;
  const surname = person.getElementsByTagName('surname')[0]?.textContent;

  if (!surname) {
    return O.none;
  }

  if (!givenName) {
    return O.some(surname);
  }

  return O.some(`${givenName} ${surname}`);
};

const organisationAuthor = (organisation: Element) => O.fromNullable(organisation.textContent);

export const getAuthors = (doc: Document, doi: Doi, logger: Logger): O.Option<ReadonlyArray<string>> => {
  const contributorsElement = getElement(doc, 'contributors');

  if (!contributorsElement || typeof contributorsElement?.textContent !== 'string') {
    logger('debug', 'Did not find contributors', { doi });
    return O.some([]);
  }

  return pipe(
    Array.from(contributorsElement.childNodes),
    RA.filter((node): node is Element => node.nodeType === node.ELEMENT_NODE),
    RA.filter((contributor) => contributor.getAttribute('contributor_role') === 'author'),
    RA.map((contributor) => match(contributor)
      .when((c) => c.tagName === 'person_name', personAuthor)
      .when((c) => c.tagName === 'organization', organisationAuthor)
      .otherwise(() => O.none)),
    O.sequenceArray,
  );
};

const crossrefCodec = t.type({
  doi_records: t.type({
    doi_record: t.type({
      crossref: t.type({
        posted_content: t.type({
          contributors: t.type({
            person_name: t.array(t.type({
              given_name: t.string,
              surname: t.string,
            })),
          }),
        }),
      }),
    }),
  }),
});

export const getAuthorsJson = (doc: JSON, doi: Doi, logger: Logger): O.Option<ReadonlyArray<string>> => pipe(
  doc,
  (foo) => { console.log(JSON.stringify(foo, null, 2)); return foo; },
  crossrefCodec.decode,
  E.fold(
    (errors) => {
      console.log(PR.failure(errors).join('\n'));
      logger('debug', 'Did not find contributors', { doi });
      return O.some([]);
    },
    (response) => pipe(
      response.doi_records.doi_record.crossref.posted_content.contributors.person_name,
      RA.map((author) => `${author.given_name} ${author.surname}`),
      O.some,
    ),
  ),
);
