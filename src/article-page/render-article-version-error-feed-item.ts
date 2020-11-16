import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderArticleVersionErrorFeedItem = () => HtmlFragment;

export default (): RenderArticleVersionErrorFeedItem => (
  () => toHtmlFragment(`
    <div class="article-feed__item_contents">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
      <div>
        <p class="article-feed__item__title">
          Published on bioRxiv
        </p>
        <p>
          We couldn't get version information from bioRxiv. Please try refreshing this page.
        </p>
      </div>
    </div>
  `)
);
