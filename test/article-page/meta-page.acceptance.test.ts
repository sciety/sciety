import { JSDOM } from 'jsdom';
import { renderMetaPage } from '../../src/article-page/render-meta-page';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryString, arbitraryWord } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';

describe('meta page acceptance criteria', () => {
  it('its possible to see the article and evaluations side by side', async () => {
    const html = renderMetaPage({
      doi: arbitraryDoi(),
      saveArticle: '',
      tweetThis: '',
      articleDetails: {
        title: arbitraryWord(),
        authors: [],
        server: 'biorxiv',
        abstract: toHtmlFragment(arbitraryString()),
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
