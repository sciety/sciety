import Doi from '../data/doi';

type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export default (): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    if (editorialCommunityId !== '53ed5364-a016-11ea-bb37-0242ac130002') {
      return '';
    }

    const endorsedArticles = [
      {
        doi: new Doi('10.1101/209320'),
        title: 'Marine cyanolichens from different littoral zones are associated with distinct bacterial communities',
      },
    ];

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <ol class="ui relaxed divided items">
          <li class="item">
            <div class="content">
              <a href="/articles/${endorsedArticles[0].doi.value}" class="header">${endorsedArticles[0].title}</a>
            </div>
          </li>
        </ol>

      </section>
    `;
  }
);
