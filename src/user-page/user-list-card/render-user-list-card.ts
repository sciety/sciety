import * as O from 'fp-ts/Option';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { defaultUserListDescription } from '../static-messages';

type UserListCardViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  handle: string,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

// TODO: should not reuse CSS classes from the group page
export const renderUserListCard = (viewModel: UserListCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="list-card">
    <h3 class="list-card__title">
      <a href="/users/${viewModel.handle}/lists/saved-articles" class="list-card__link">Saved articles</a>
    </h3>
    <p>${defaultUserListDescription(`@${viewModel.handle}`)}.</p>
    <div class="list-card__meta">
      <span class="visually-hidden">This list contains </span><span>${viewModel.articleCount} article${viewModel.articleCount === 1 ? '' : 's'}</span>${lastUpdated(viewModel.lastUpdated)}
    </div>
  </article>
`);
