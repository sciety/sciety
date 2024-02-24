import { ViewModel } from '../view-model.js';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor.js';
import { NotHtml } from '../../../html-page.js';

export const renderDescription = (viewmodel: ViewModel): NotHtml => `${renderCountWithDescriptor(viewmodel.listCount, 'list', 'lists')} | Following ${renderCountWithDescriptor(viewmodel.groupIds.length, 'group', 'groups')}` as NotHtml;
