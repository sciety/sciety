import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

const banner = `
  <div class="success-banner">
    <div class="success-banner__heading">
      <h2>Success</h2>
    </div>
    <p>
      Your comment has been added. You are contributing to a network of researchers advancing open science.
    </p>
  </div>
`;

export const renderSuccessBanner = (): HtmlFragment => (
  process.env.EXPERIMENT_ENABLED
    ? toHtmlFragment(banner)
    : toHtmlFragment('')
);
