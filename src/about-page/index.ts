import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import convertMarkdownToHtml from './convert-markdown-to-html';
import readFile from './read-file';
import renderAboutPage from './render-about-page';

export default (): Middleware => (
  compose([
    readFile('/static/about.md'),
    convertMarkdownToHtml(),
    renderAboutPage(),
  ])
);
