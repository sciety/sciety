import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { CurationStatement, ViewModel } from '../view-model';
import { templateListItems } from '../../../shared-components/list-items';

const renderCurationStatement = (curationStatement: CurationStatement) => toHtmlFragment(`
  <div class="curation-statement-header">
    <h2>Curated by ${curationStatement.groupName}</h2>
    <img src="${curationStatement.groupLargeLogo}" alt="${curationStatement.groupName} logo">
  </div>
  ${curationStatement.statement}
`);

export const renderCurationStatements = (viewmodel: ViewModel): HtmlFragment => {
  if (viewmodel.curationStatements.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    viewmodel.curationStatements,
    RA.map(renderCurationStatement),
    (listItems) => templateListItems(listItems, 'curation-statement'),
    (listItems) => `<ul class="curation-statements">${listItems}</ul>`,
    toHtmlFragment,
  );
};
