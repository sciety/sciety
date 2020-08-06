import createRenderFollowToggle from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderEditorialCommunities = () => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (editorialCommunities: GetAllEditorialCommunities): RenderEditorialCommunities => {
  const renderFollowToggle = createRenderFollowToggle();

  return async () => {
    const editorialCommunityLinks = await Promise.all((await editorialCommunities())
      .map(async (editorialCommunity) => (`
        <div class="content">
          <a href="/editorial-communities/${editorialCommunity.id.value}" class="header">${editorialCommunity.name}</a>
          ${await renderFollowToggle(editorialCommunity.id)}
        </div>
      `)));

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
  };
};
