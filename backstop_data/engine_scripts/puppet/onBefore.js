module.exports = async (page, scenario, vp) => {

  if (!scenario.showCookieConsent) {
    const cookieConsentCookie = {
      url: "https://.sciety.org",
      name: "cookieconsent_status",
      value: "deny",
    }
    await page.setCookie(cookieConsentCookie);
  }
};
