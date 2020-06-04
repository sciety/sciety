export default (items: Array<string>): string => (
  items.reduce((carry: string, item: string): string => `${carry}<li class="item">${item}</li>\n`, '')
);
