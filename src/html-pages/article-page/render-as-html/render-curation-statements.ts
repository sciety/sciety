import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { CurationStatement, ViewModel } from '../view-model';
import { templateListItems } from '../../../shared-components/list-items';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';

const renderCurationStatement = (curationStatement: CurationStatement) => toHtmlFragment(`
  <section>
    <header class="curation-statement-header">
      <h2>Curated by <a href="/groups/${curationStatement.groupSlug}">${curationStatement.groupName}</a></h2>
      <img src="${curationStatement.groupLogo}" alt="${curationStatement.groupName} logo">
    </header>
    <div${renderLangAttribute(curationStatement.statementLanguageCode)} class="curation-statement-text">
      ${curationStatement.statement}
    </div>
  </section>
`);

export const renderCurationStatements = (viewmodel: ViewModel): HtmlFragment => {
  if (viewmodel.curationStatements.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    viewmodel.curationStatements,
    RA.map(renderCurationStatement),
    (listItems) => templateListItems(listItems, 'curation-statement'),
    (listItems) => `<span class="visually-hidden">Curation statements for this article: </span><ul class="curation-statements" role="list">${listItems}</ul>`,
    toHtmlFragment,
  );
};
