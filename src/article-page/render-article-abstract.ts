import Doi from '../data/doi';

interface ArticleAbstract {
  content: string;
}

export type GetArticleAbstract = (doi: Doi) => Promise<ArticleAbstract>;

type RenderArticleAbstract = (doi: Doi) => Promise<string>;

export default (getArticleAbstract: GetArticleAbstract): RenderArticleAbstract => (
  async (doi) => {
    const articleAbstract = await getArticleAbstract(doi);

    return `
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        <div class="abstract">
          ${articleAbstract.content}
          <a href="https://doi.org/${doi}" class="abstract__link">
            Read the full article
          </a>
        </div>
      </section>
    `;
  }
);
