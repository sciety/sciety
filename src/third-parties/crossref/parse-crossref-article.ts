import { XMLSerializer } from '@xmldom/xmldom';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { Logger } from '../../infrastructure/logger';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

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
  O.chain((resource) => {
    if (resource.includes('://medrxiv.org')) {
      return O.some('medrxiv' as const);
    }
    if (resource.includes('://biorxiv.org')) {
      return O.some('biorxiv' as const);
    }

    return O.none;
  }),
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

export const getAuthors = (doc: Document): O.Option<ReadonlyArray<string>> => {
  const contributorsElement = getElement(doc, 'contributors');

  if (!contributorsElement || typeof contributorsElement?.textContent !== 'string') {
    return O.none;
  }

  const authors = Array.from(contributorsElement.childNodes)
    .filter((node): node is Element => node.nodeType === node.ELEMENT_NODE)
    .filter((contributor) => contributor.getAttribute('contributor_role') === 'author')
    .map((contributor) => {
      switch (contributor.tagName) {
        case 'person_name':
          return personAuthor(contributor);
        case 'organization':
          return organisationAuthor(contributor);
      }

      return O.none;
    });

  return pipe(authors, O.sequenceArray);
};
