module.exports = async (page, scenario, vp) => {

  if (!scenario.showCookieConsent) {
    const cookieConsentCookie = {
      url: "http://sciety_app",
      name: "cookieconsent_status",
      value: "deny",
    }
    await page.setCookie(cookieConsentCookie);
  }
};
