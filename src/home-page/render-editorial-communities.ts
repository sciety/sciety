import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: Maybe<UserId>) => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (
  editorialCommunities: GetAllEditorialCommunities,
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunities => async (userId) => {
  const editorialCommunityLinks = await Promise.all((await editorialCommunities())
    .map(async (editorialCommunity) => (`
        <div class="content">
          <a href="/editorial-communities/${editorialCommunity.id.value}" class="header">${editorialCommunity.name}</a>
          <div class="extra">
            ${await renderFollowToggle(userId, editorialCommunity.id)}
          </div>
        </div>
      `)));

  return `
      <section>
        <h2 class="ui header">
          Editorial communities
        </h2>
        <ol class="ui divided items" role="list">
          ${templateListItems(editorialCommunityLinks)}
        </ol>
      </section>
    `;
};
