import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderEditorialCommunities = () => Promise<string>;

type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (editorialCommunities: GetAllEditorialCommunities): RenderEditorialCommunities => (
  async () => {
    const editorialCommunityLinks = (await editorialCommunities())
      .map((editorialCommunity) => (`
        <div class="content">
          <a href="/editorial-communities/${editorialCommunity.id.value}" class="header">${editorialCommunity.name}</a>
        </div>
      `));

    return `
      <section>
        <h2 class="ui header">
          Editorial communities
        </h2>
        <ol class="ui divided items">
          ${templateListItems(editorialCommunityLinks)}
        </ol>
      </section>
    `;
  }
);
