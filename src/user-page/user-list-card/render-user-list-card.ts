import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type UserListCardViewModel = {
  articleCount: number,
  handle: string,
};

export const renderUserListCard = (viewModel: UserListCardViewModel): HtmlFragment => toHtmlFragment(`
  <div class="list-card">
    <h3 class="list-card__title">
      <a href="/users/${viewModel.handle}/lists/saved-articles" class="list-card__link">Saved articles</a>
    </h3>
    <p>Articles that have been saved by @${viewModel.handle}, most recently saved first.</p>
  </div>
`);
