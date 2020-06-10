import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';

interface ReviewedArticle {
  doi: Doi;
  title: string;
}

const templateTeaser = (article: ReviewedArticle): string => (`
  <div class="content">
    <a href="/articles/${article.doi}" class="header">${article.title}</a>
  </div>
`);

export default (reviewedArticles: Array<ReviewedArticle>): string => (`
  <section class="ui basic vertical segment">

    <h2 class="ui header">
      Recently reviewed articles
    </h2>

    <ol class="ui relaxed divided items">
      ${templateListItems(reviewedArticles.map(templateTeaser))}
    </ol>

  </section>
`);
