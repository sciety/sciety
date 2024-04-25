import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderLangAttribute } from '../../../../shared-components/lang-attribute';
import { renderListItems } from '../../../../shared-components/render-list-items';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

const renderGroupLogo = (curationStatement: ViewModel['curationStatements'][number]) => pipe(
  curationStatement.groupLogoSrc,
  O.match(
    () => '',
    (logoSrc) => `<img src="${logoSrc}" alt="${htmlEscape(curationStatement.groupName)} logo">`,
  ),
);

const renderCurationStatement = (curationStatement: ViewModel['curationStatements'][number]) => toHtmlFragment(`
  <section>
    <header class="curation-statement-header">
      <h2>Curated by <a href="${curationStatement.groupPageHref}">${htmlEscape(curationStatement.groupName)}</a></h2>
      ${renderGroupLogo(curationStatement)}
    </header>
    <div${renderLangAttribute(curationStatement.statementLanguageCode)} class="curation-statement-full-text">
      ${curationStatement.statement}
    </div>
  </section>
`);

export const renderCurationStatements = (curationStatements: ViewModel['curationStatements']): HtmlFragment => {
  if (curationStatements.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    curationStatements,
    RA.map(renderCurationStatement),
    (listItems) => renderListItems(listItems, 'curation-statement'),
    (listItems) => `<span class="visually-hidden">Curation statements for this article: </span><ul class="curation-statements" role="list">${listItems}</ul>`,
    toHtmlFragment,
  );
};
