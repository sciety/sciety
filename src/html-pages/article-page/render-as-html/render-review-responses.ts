import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import * as RI from '../../../types/evaluation-locator';
import { ResponseCounts } from '../view-model';

export const renderReviewResponses = (
  evaluationLocator: RI.EvaluationLocator,
  counts: ResponseCounts,
  current: O.Option<'helpful' | 'not-helpful'>,
): HtmlFragment => {
  const saidHelpful = pipe(current, O.filter((value) => value === 'helpful'), O.isSome);
  const saidNotHelpful = pipe(current, O.filter((value) => value === 'not-helpful'), O.isSome);

  // TODO: Move 'You said this evaluation is helpful' etc to visually hidden span before button.
  // TODO: Change the label when the other button is selected
  const helpfulButton = (count: number): HtmlFragment => (saidHelpful
    ? toHtmlFragment(`<button type="submit" name="command" value="revoke-response" aria-label="You said this evaluation is helpful; press to undo." class="responses__button">${count}<span class="visually-hidden"> people said this evaluation is helpful</span><img src="/static/images/thumb-up-solid.svg" alt="" class="responses__button__icon"></button>`)
    : toHtmlFragment(`<button type="submit" name="command" value="respond-helpful" aria-label="This evaluation is helpful" class="responses__button">
      ${count}<span class="visually-hidden"> people said this evaluation is helpful</span><img src="/static/images/thumb-up-outline.svg" alt="" class="responses__button__icon">
      </button>`));
  const notHelpfulButton = (count: number): HtmlFragment => (saidNotHelpful
    ? toHtmlFragment(`<button type="submit" name="command" value="revoke-response" aria-label="You said this evaluation is not helpful; press to undo." class="responses__button">${count}<span class="visually-hidden"> people said this evaluation is not helpful</span><img src="/static/images/thumb-down-solid.svg" alt="" class="responses__button__icon"></button>`)
    : toHtmlFragment(`<button type="submit" name="command" value="respond-not-helpful" aria-label="This evaluation is not helpful" class="responses__button">${count}<span class="visually-hidden"> people said this evaluation is not helpful</span><img src="/static/images/thumb-down-outline.svg" alt="" class="responses__button__icon"></button>`));
  return toHtmlFragment(`
    <div class="responses">
      <div class="responses__question">Was this evaluation helpful?</div>
      <div class="responses__actions">
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${RI.evaluationLocatorCodec.encode(evaluationLocator)}">
            ${helpfulButton(counts.helpfulCount)}
          </form>
        </div>
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${RI.evaluationLocatorCodec.encode(evaluationLocator)}">
            ${notHelpfulButton(counts.notHelpfulCount)}
          </form>
        </div>
      </div>
    </div>
  `);
};
