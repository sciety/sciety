import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment.js';
import { GroupLinkAsTextViewModel } from './group-link-as-text-view-model.js';

export const renderGroupLinkAsText = (group: GroupLinkAsTextViewModel): HtmlFragment => toHtmlFragment(`<a href="${group.href}">${htmlEscape(group.groupName)}</a>`);
