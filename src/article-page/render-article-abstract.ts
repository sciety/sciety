import { Result } from 'true-myth';
import Doi from '../types/doi';

interface ArticleAbstract {
  content: string;
}

export type GetArticleAbstract = (doi: Doi) => Promise<Result<ArticleAbstract, 'not-found' | 'unavailable'>>;

export type RenderArticleAbstract = (doi: Doi) => Promise<Result<string, 'not-found' | 'unavailable'>>;

export default (getArticleAbstract: GetArticleAbstract): RenderArticleAbstract => (
  async (doi) => (
    (await getArticleAbstract(doi)).map((articleAbstract) => `
      <section role="doc-abstract">
        <h2 class="ui header">
          Abstract
        </h2>
          ${articleAbstract.content}
          <a href="https://doi.org/${doi.value}" class="ui basic secondary button">
            Read the full article
            <i class="right chevron icon"></i>
          </a>
      </section>
      <div class="ui hidden clearing section divider"></div>
    `)
  )
);
