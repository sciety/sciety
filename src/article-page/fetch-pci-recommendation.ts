import { URL } from 'url';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { GetRecommendationContent } from './get-hardcoded-recommendations';
import { Logger } from '../infrastructure/logger';

export default (logger: Logger): GetRecommendationContent => (
  async (url: URL) => {
    const { data: html } = await axios.get<string>(url.toString(), { headers: { Accept: 'text/html' } });

    logger('debug', 'Fetched PCI page', { html });
    const theDom = new JSDOM(html);
    const text = theDom.window.document.querySelector(
      '.pci-article-div .pci-recommendation-div .pci-bigtext',
    );
    if (text === null) {
      throw new Error(`Cannot find PCI recommendation for ${url.toString()}`);
    }
    return text.innerHTML;
  }
);
