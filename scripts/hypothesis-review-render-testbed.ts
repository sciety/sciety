const { Remarkable } = require('remarkable');
const { linkify } = require('remarkable/linkify');
const sanitiseHtml = require('sanitize-html');

const text = ``;

const converter = new Remarkable({ html: true }).use(linkify);

console.log(sanitiseHtml(converter.render(text)));
