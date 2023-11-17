import { ViewModel } from '../view-model.js';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor.js';

export const renderDescription = (viewmodel: ViewModel): string => `${renderCountWithDescriptor(viewmodel.listCount, 'list', 'lists')} | Following ${renderCountWithDescriptor(viewmodel.groupIds.length, 'group', 'groups')}`;
