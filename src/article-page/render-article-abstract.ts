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
        <h2>
          Abstract
        </h2>
          ${articleAbstract.content}
          <a href="https://doi.org/${doi.value}" class="article-call-to-action-link">
            Read the full article
          </a>
      </section>
    `)
  )
);
