import { JSDOM } from 'jsdom';
import { renderMetaPage } from '../../src/article-page/render-meta-page';
import { arbitraryHtmlFragment, arbitraryWord } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';

describe('meta page acceptance criteria', () => {
  it('allows the full article and evaluations to be viewed side by side on desktop', async () => {
    const html = renderMetaPage({
      doi: arbitraryDoi(),
      saveArticle: arbitraryHtmlFragment(),
      tweetThis: arbitraryHtmlFragment(),
      articleDetails: {
        title: arbitraryWord(),
        authors: [],
        server: 'biorxiv',
        abstract: arbitraryHtmlFragment(),
      },
    });

    const doc = JSDOM.fragment(html);

    const doiLink = doc.querySelector('.article-meta-data-list a');
    const readFullArticleLink = doc.querySelector('.full-article-button');

    const doiLinkTarget = doiLink?.getAttribute('target');
    const readFullArticleLinkTarget = readFullArticleLink?.getAttribute('target');

    expect(doiLinkTarget).toStrictEqual('_blank');
    expect(readFullArticleLinkTarget).toStrictEqual('_blank');
  });
});
