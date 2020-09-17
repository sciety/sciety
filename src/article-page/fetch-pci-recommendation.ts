import { URL } from 'url';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { GetEndorsement } from './get-hardcoded-endorsements';
import { Logger } from '../infrastructure/logger';

export default (logger: Logger): GetEndorsement => (
  async (doi) => {
    const url = new URL(`https://doi.org/${doi.value}`);
    const { data: html } = await axios.get<string>(
      url.toString(),
      { headers: { Accept: 'text/html' } },
    );

    logger('debug', 'Fetched PCI page', { html });
    const theDom = new JSDOM(html);
    const text = theDom.window.document.querySelector(
      '.pci-article-div .pci-recommendation-div .pci-bigtext',
    );
    const title = theDom.window.document.querySelector(
      '.pci-article-div .pci-recommendation-div h2',
    );
    const date = theDom.window.document.querySelector(
      'meta[name="citation_publication_date"]',
    )?.getAttribute('content');

    if (text === null || title === null || !date) {
      throw new Error(`Cannot find PCI recommendation for ${url.toString()}`);
    }

    return {
      date: new Date(date),
      title: title.innerHTML,
      content: text.innerHTML,
      author: 'B. Jesse Shapiro',
    };
  }
);
