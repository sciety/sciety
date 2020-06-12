type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export default (): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    if (editorialCommunityId !== '53ed5364-a016-11ea-bb37-0242ac130002') {
      return '';
    }
    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <ol class="ui relaxed divided items">
          <li class="item">
            <div class="content">
              <a href="/articles/10.1101/209320" class="header">Marine cyanolichens from different littoral zones are associated with distinct bacterial communities</a>
            </div>
          </li>
        </ol>

      </section>
    `;
  }
);
