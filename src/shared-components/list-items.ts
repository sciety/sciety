export default (items: Array<string>, itemClass = 'item'): string => (
  items.reduce((carry: string, item: string): string => `${carry}<li class="${itemClass}">${item}</li>\n`, '')
);
