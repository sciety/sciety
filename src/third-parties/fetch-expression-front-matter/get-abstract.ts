import { load } from 'cheerio';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CommonFrontMatter } from './parser-and-codec';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

const removeSuperfluousTitles = (html: string) => {
  const model = load(html);
  model('h3').first().remove();
  model('h3:contains("Graphical abstract")').remove();
  return model.html();
};

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

const stripEmptySections = (html: string) => pipe(
  html,
  toHtmlFragment,
  sanitise,
  (sanitised) => sanitised.replace(/<section>\s*<\/section>/g, ''),
);

export const getAbstract = (
  commonFrontmatter: CommonFrontMatter,
): O.Option<SanitisedHtmlFragment> => pipe(
  commonFrontmatter.abstract,
  O.map(transformXmlToHtml),
  O.map(removeSuperfluousTitles),
  O.map(stripEmptySections),
  O.map((output) => output.trim()),
  O.map(toHtmlFragment),
  O.map(sanitise),
);
