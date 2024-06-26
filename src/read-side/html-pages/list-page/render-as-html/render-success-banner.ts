import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderSuccessBanner = (viewModel: ViewModel): HtmlFragment => (
  viewModel.showAnnotationSuccessBanner
    ? toHtmlFragment(`
  <div class="success-banner" role="region" aria-labelledby="success-notification-banner-title" >
    <div class="success-banner__heading">
      <h2 id="success-notification-banner-title">Success</h2>
    </div>
    <p>
      Your comment has been added. You are contributing to a network of researchers advancing open science.
    </p>
  </div>
`)
    : toHtmlFragment('')
);
