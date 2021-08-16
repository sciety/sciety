import { htmlEscape } from 'escape-goat';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Group = {
  avatarPath: string,
  id: GroupId,
  name: string,
};

export type RenderGroup = (group: Group) => HtmlFragment;

export const renderGroup: RenderGroup = (group: Group) => toHtmlFragment(`
  <div class="group">
    <a href="/groups/${group.id}" class="group__link">
      <img src="${group.avatarPath}" alt="" class="group__avatar">
      <div class="group__name">
        ${htmlEscape(group.name)}
      </div>
    </a>
  </div>
`);
