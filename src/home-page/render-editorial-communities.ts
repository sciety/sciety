import { URL } from 'url';
import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: Maybe<UserId>) => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  avatar: URL;
  id: EditorialCommunityId;
  name: string;
}>>;

export default (
  editorialCommunities: GetAllEditorialCommunities,
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunities => async (userId) => {
  const editorialCommunityLinks = await Promise.all((await editorialCommunities())
    .map(async (editorialCommunity) => (`
          <div class="editorial-community">
            <a href="/editorial-communities/${editorialCommunity.id.value}" class="editorial-community__link">
              <img src="${editorialCommunity.avatar.toString()}" alt="" class="editorial-community__avatar">
              <div class="editorial-community__name">
                ${editorialCommunity.name}
              </div>
            </a>
            <div class="editorial-community__toggle_wrapper">
              ${await renderFollowToggle(userId, editorialCommunity.id, editorialCommunity.name)}
            </div>
          </div>
      `)));

  return `
      <section>
        <h2>
          Editorial communities
        </h2>
        <ol class="editorial-community-list" role="list">
          ${templateListItems(editorialCommunityLinks, 'editorial-community-list__item')}
        </ol>
      </section>
    `;
};
