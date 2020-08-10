import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type RenderEditorialCommunities = (followList: FollowList) => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (
  editorialCommunities: GetAllEditorialCommunities,
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunities => async (followList) => {
  const editorialCommunityLinks = await Promise.all((await editorialCommunities())
    .map(async (editorialCommunity) => (`
        <div class="content">
          <a href="/editorial-communities/${editorialCommunity.id.value}" class="header">${editorialCommunity.name}</a>
          <div class="extra">
            ${await renderFollowToggle(followList, editorialCommunity.id)}
          </div>
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
