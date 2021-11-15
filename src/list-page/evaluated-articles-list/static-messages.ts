import { toHtmlFragment } from '../../types/html-fragment';

const staticMessage = (message: string) => toHtmlFragment(`<p class="evaluated-articles__static_message">${message}</p>`);

export const noEvaluatedArticlesMessage = staticMessage(
  'It looks like this group hasn’t evaluated any articles yet. Try coming back later!',
);

export const noArticlesCanBeFetchedMessage = staticMessage(
  'This information can\'t be fetched right now. Please try again later.',
);
