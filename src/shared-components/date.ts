const textFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const toString = (date: Date): string => date.toISOString().split('T')[0];
const toDisplayString = (date: Date): string => date.toLocaleDateString('en-US', textFormatOptions);

export default (date: Date, className?: string): string => {
  const classNameAttribute = className ? ` class="${className}"` : '';
  return `<time datetime="${toString(date)}"${classNameAttribute}>${toDisplayString(date)}</time>`;
};
