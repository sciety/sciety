import { $ } from 'taiko';

export const isLoggedIn = async (): Promise<boolean> => {
  const buttonText = await $('.utility-bar__list_link_secondary_button').text();
  return buttonText === 'Log Out';
};
