import { Maybe, Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderPage = (userId: Maybe<UserId>) => Promise<Result<{content: HtmlFragment}, never>>;

type Component = (userId: Maybe<UserId>) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderSearchForm: Component,
  renderFeed: Component,
): RenderPage => async (userId) => Result.ok({
  title: 'Sciety: where research is evaluated and curated by the communities you trust',
  content: toHtmlFragment(`
    <div class="sciety-grid sciety-grid--home">
      ${await renderPageHeader(userId)}

      <div class="home-page-feed-container">
        ${await renderFeed(userId)}
      </div>

      <div class="home-page-side-bar">
        ${await renderSearchForm(userId)}
        ${await renderEditorialCommunities(userId)}
      </div>

    </div>
  `),
});
