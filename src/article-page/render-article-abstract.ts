import Doi from '../types/doi';

interface ArticleAbstract {
  content: string;
}

export type GetArticleAbstract = (doi: Doi) => Promise<ArticleAbstract>;

export type RenderArticleAbstract = (doi: Doi) => Promise<string>;

export default (getArticleAbstract: GetArticleAbstract): RenderArticleAbstract => (
  async (doi) => {
    const articleAbstract = await getArticleAbstract(doi);

    return `
      <section role="doc-abstract">
        <h2 class="ui header">
          Abstract
        </h2>
          ${articleAbstract.content}
          <a href="https://doi.org/${doi}" class="ui basic secondary button">
            Read the full article
            <i class="right chevron icon"></i>
          </a>
      </section>
      <div class="ui hidden clearing section divider"></div>
    `;
  }
);
