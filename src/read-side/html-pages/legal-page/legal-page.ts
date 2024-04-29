import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

export const legalPage: HtmlPage = toHtmlPage({
  title: 'Legal information',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Legal information</h1>
    </header>

    <div>
      <h2>Terms and conditions</h2>
      <p>
        This website is operated by eLife Sciences Publications, Ltd under their terms and conditions as
        set out at <a href="https://elifesciences.org/terms">elifesciences.org/terms</a> unless otherwise stated through amendments below.
      </p>
      <p>
        Content is subject to a Creative Commons Attribution license, except where otherwise noted.
      </p>
      <h3>
        Exceptions to ownership
      </h3>
      <p>
        Unless otherwise indicated the Group names, logos and trademarks are owned by
        their respective owners and not by eLife or its licensors.
        The article content is created by the authors stated on the article page and is not owned by
        eLife or its licensors, and is subject to the licence terms shown against it.
        Evaluation content is created by the Group named alongside the evaluation content
        and is not owned by eLife or its licensors, and is subject to the licence terms shown on the Group's page.
      </p>
      <h3>Use license</h3>
      <p>
        To provide article recommendations we make use of the <a href="https://www.semanticscholar.org/">Semantic Scholar Paper Corpus</a> (licensed under <a href="https://opendatacommons.org/licenses/by/1-0/">ODC-BY</a>). Semantic Scholar compiles hundreds of millions of published papers across many scientific fields.
      </p>

      <h2>Privacy notice</h2>

      <p>
        This Privacy Notice relates to data held and processed by eLife Sciences Publications, Ltd
        who operate this site. For all queries relating to personal data and privacy, please contact
        us at <a href="mailto:data@elifesciences.org">data@elifesciences.org</a>.
      </p>

      <p>
        Full details of the Privacy Notice can be found at
        <a href="https://elifesciences.org/privacy">elifesciences.org/privacy</a>.
      </p>
      <h3>
        What additional personal information does this site hold?
      </h3>
      <p>
        This site adds the following to the information specified in the privacy notice linked above.
      </p>

      <h4>Auth0</h4>
      <p>
      Sciety uses Auth0 to authenticate you to the web app when you sign up or log in with an email address and password or choose an alternative login provider, and this information is passed to and  stored in Auth0. The personal data stored in Auth0 is used only for the legitimate interest purposes of providing its services, namely authenticating users and not passed to any third party.  If you log in using any other type of connection, for example Twitter, Auth0 stores information provided by the external identity provider such as a user name and user identifier.
      </p>
      <p>
      Sciety has a legitimate interest in the user identifier to provide functionality, as it is associated with items that you follow on the site (groups, people, papers and evaluation events), lists you create and used to publicly display events that you follow on your user page. This information is not shared with any third parties, expect for those who help us process this data, and then solely for that purpose.
      </p>

      <h4>Hotjar</h4>
      <p>
      Sciety makes use of a user behaviour analytics tool called Hotjar that helps us better understand the experience of using Sciety (e.g. how much time you spend on which pages, which links you choose to click, what you like and don’t like, etc.) and this enables us to build and maintain our service with user feedback. 
      </p>
      <p>
      Hotjar uses cookies and other technologies to collect data on our users’ behaviour and their devices. This includes a device's IP address (processed during your session and stored in a de-identified form), device screen size, device type (unique device identifiers), browser information, geographic location (country only), and the preferred language used to display our website. Hotjar stores this information on our behalf in a pseudonymized user profile. If you disable analytics cookies on Sciety, you won’t be tracked Hotjar. To disable analytics cookies, change your consent below. Hotjar is contractually forbidden to sell any of the data collected on our behalf. Hotjar carry out all processing operations in strict compliance with the EU General Data Protection Regulation (“GDPR”) (specifically but not limited to Article 6(1)(b) to (f) and Article 28) as well as the Laws of Malta, where Hotjar is incorporated, and other applicable global privacy and data protection laws such as the California Consumer Privacy Act (“CCPA”).
      </p>

      <h4>Jotform</h4>
      <p>
      Jotform is used by Sciety to collect email address data for the purposes of providing transactional notifications related to curation activity and pass this to Mailchimp to send list subscription emails. Jotform treats unique form questions and responses as information that is private, unless a party other than Jotform has made that information public. Jotform does not sell form data from Sciety, nor do they make it available to third parties without the Sciety’s permission. Data is only retained in Jotform for the time needed to process it, and is deleted after 24 hours.
      </p>

      <h4>Mailchimp</h4>
      <p>
      Mailchimp is used by Sciety to send transactional (for example list subscription notifications) and marketing emails (for example newsletters), which you can unsubscribe from by clicking the link at the bottom of the email. Sciety shares your contact information with mailchimp, our email marketing provider, so they can send these emails on our behalf. Mailchimp does not sell user data, but may share it with a sub-processor for storage and other processing necessary to provide, maintain and improve the service provided to Sciety.
      </p>

      <h3>
        Privacy notice changes
      </h3>
      <h4>
        Change log
      </h4>
      <p>
        Although most changes are likely to be minor, eLife may change its Privacy Notice from time to time, and at our sole discretion. We encourage visitors to check this page frequently for any changes to its Privacy Notice. First published October 19, 2020.
      </p>

      <p>
        1st June 2021: added Intercom information to Sciety privacy policy.
      </p>

      <p>
        2nd June 2021: added Microsoft Clarity information to Sciety privacy policy.
      </p>

      <p>
        15th June 2021: clarified the exact use of data by Intercom and Microsoft Clarity as their own documentation was too broad.
      </p>

      <p>
        22nd September 2022: removed Intercom and Microsoft Clarity information from Sciety privacy policy as we are no longer using these services.
      </p>

      <p>
        01st March 2023: added  Auth0 and Hotjar information.
      </p>

      <p>
        5th September 2023: Clarified information on Auth0 and Hotjar. Added Mailchimp and Jotform.
      </p>

      <div id="cookieDeclaration">
        <h2>Cookie declaration</h2>
        <noscript>
          <p>You do not have Javascript enabled, so we do not use tracking cookies.</p>
        </noscript>
        <script id="CookieDeclaration" src="https://consent.cookiebot.com/56f22051-f915-4cf1-9552-7d8f64d81152/cd.js" type="text/javascript" async></script>
      </div>
      
      <h2>Company information</h2>
      <p>
        Sciety is operated by a team based within eLife Sciences Publications Limited. It is steered by all of its groups, readers and authors.
      </p>

      <p>
        eLife Sciences Publications, Ltd is a limited liability non-profit non-stock corporation incorporated
        in the State of Delaware, USA, with company number 5030732, and is registered in the UK with company
        number FC030576 and branch number BR015634 at the address:
      </p>

      <address>
        eLife Sciences Publications, Ltd<br>
        Westbrook Centre, Milton Road<br>
        Cambridge CB4 1YG<br>
        UK
      </address>
    </div>
  `),
});
