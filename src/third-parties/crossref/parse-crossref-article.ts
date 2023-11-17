import { XMLSerializer } from '@xmldom/xmldom';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { flow, pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors.js';
import { ArticleServer, articleServers } from '../../types/article-server.js';
import { ArticleId } from '../../types/article-id.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment.js';
import { Logger } from '../../shared-ports/index.js';

const getElement = (ancestor: Document | Element, qualifiedName: string) => (
  ancestor.getElementsByTagName(qualifiedName).item(0)
);

export const getAbstract = (doc: Document, doi: ArticleId, logger: Logger): O.Option<SanitisedHtmlFragment> => {
  const abstractElement = getElement(doc, 'abstract');

  if (typeof abstractElement?.textContent !== 'string') {
    return O.none;
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
    O.some,
  );
};

export const getTitle = (doc: Document): O.Option<SanitisedHtmlFragment> => {
  const titlesElement = getElement(doc, 'titles');
  const titleElement = titlesElement?.getElementsByTagName('title')[0];
  if (titleElement) {
    const title = new XMLSerializer()
      .serializeToString(titleElement)
      .replace(/^<title(?:.?)>([\s\S]*)<\/title>$/, '$1')
      .trim();
    return pipe(
      title,
      toHtmlFragment,
      sanitise,
      O.some,
    );
  }
  return O.none;
};

export const getServer = flow(
  (doc: Document) => {
    const doiDataElement = getElement(doc, 'doi_data');
    const resourceElement = doiDataElement?.getElementsByTagName('resource')[0];
    return resourceElement?.textContent;
  },
  O.fromNullable,
  O.chain((resource) => pipe(
    articleServers,
    R.filter((info) => resource.includes(`://${info.domain}`)),
    R.keys,
    A.match(
      () => O.none,
      (keys) => O.some(keys[0] as ArticleServer),
    ),
  )),
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

export const getAuthors = (doc: Document): ArticleAuthors => {
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
