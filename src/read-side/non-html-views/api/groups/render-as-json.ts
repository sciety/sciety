import { ViewModel } from './view-model';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

export const renderAsJson = (viewModel: ViewModel): NonHtmlViewRepresentation => toNonHtmlViewRepresentation(viewModel, 'application/json');
