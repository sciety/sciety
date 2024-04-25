import { successBanner } from '../../../../shared-components/success-banner/success-banner';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderSuccessBanner = (viewModel: ViewModel): HtmlFragment => (
  viewModel.showAnnotationSuccessBanner
    ? successBanner('Your comment has been added. You are contributing to a network of researchers advancing open science.')
    : toHtmlFragment('')
);
