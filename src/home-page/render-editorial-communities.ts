import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderEditorialCommunities = () => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (editorialCommunities: GetAllEditorialCommunities): RenderEditorialCommunities => (
  async () => {
    const editorialCommunityLinks = (await editorialCommunities())
      .map((editorialCommunity) => (`
        <div class="content">
          <a href="/editorial-communities/${editorialCommunity.id.value}" class="header">${editorialCommunity.name}</a>
          <form method="post" action="/unfollow">
            <input type="hidden" name="editorialcommunityid" value="${editorialCommunity.id.value}" />
            <button type="submit">Unfollow</button>
          </form>
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
