import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import sanitiseHtml from 'sanitize-html';

const text = '- list item';

const converter = new Remarkable({ html: true }).use(linkify);

process.stdout.write(sanitiseHtml(converter.render(text)));
