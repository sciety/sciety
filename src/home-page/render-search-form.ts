import * as T from 'fp-ts/Task';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFindArticle = T.Task<HtmlFragment>;

const searchIconSvg = toHtmlFragment('<svg class="search-form__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><style>.st1{fill:none}</style><path class="st0" d="M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/><path class="st1" d="M0 0h24v24H0V0z"/></svg>');

export const renderSearchForm = (): RenderFindArticle => T.of(toHtmlFragment(`
  <section class="search-form">
    <form method="get" action="/articles">

      <h3>
        Search bioRxiv content
      </h3>

      <div class="search-form__inputs">
        <input type="text" size="19" name="query" placeholder="Keywords, author name, DOI ..." class="search-form__input" required><button type="submit" class="search-form__button">${searchIconSvg}</button>
      </div>

    </form>
  </section>
`));
