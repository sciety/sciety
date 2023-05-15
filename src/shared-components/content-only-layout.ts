import { Page } from '../types/page';

export const contentOnlyLayout = () => (page: Page): Page['content'] => page.content;
