import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { articleIdFieldName } from './save-article-handler';

const renderAnnotationContentTextarea = (listId: ListId) => (process.env.EXPERIMENT_ENABLED === 'true' ? `
    <label for="annotationContent-${listId}">Annotation content</label>
    <textarea id="annotationContent-${listId}" name="annotationContent"></textarea>
`
  : '');

export const renderSaveToListForm = (doi: Doi, listId: ListId, listName: string): HtmlFragment => toHtmlFragment(`
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <input type="hidden" name="listId" value="${listId}">
    <div class="list-name">${listName}</div>
    ${renderAnnotationContentTextarea(listId)}
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`);
