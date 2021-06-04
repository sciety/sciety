import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

const html = `
    <!doctype html>
<!--[if IE 7 ]> <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]> <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>    <meta charset="UTF-8" />

    <!-- Meta desc -->
    <meta name="description" content="" />

    <!-- Robots -->
    <meta name="robots" content="/robots.txt" />
    <!-- Prevent Search Engines using DMOZ data. -->
    <meta name="robots" content="NOODP">

    <!-- Canonical -->
    <link rel="canonical" href="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Disable skype from styling numbers as skype buttons -->
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />

    <!-- For IE, use the latest supported mode, see http://stackoverflow.com/a/6771584 -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese" rel="stylesheet">
    <link rel="stylesheet" href="https://use.typekit.net/agx8fit.css">

    <link rel="stylesheet" href="/dist/styles.min.css?v=1619685852">
    
    <link rel="stylesheet" href="https://prelights.biologists.com/wp-content/themes/thecobpph/tooltip.css">

    <!-- Icons - https://github.com/audreyr/favicon-cheat-sheet -->
    <!-- ICO generator: http://www.favicomatic.com -->
    <!-- IE6-10 -->
    <link rel="shortcut icon" sizes="16x16 24x24 32x32 48x48 64x64" href="/favicon.ico">
    <!-- Everybody else -->
    <link rel="icon" sizes="16x16 24x24 32x32 48x48 64x64" href="/favicon.ico">
    <!-- iOS 2.0+ and Android 2.1+ -->
    <link rel="apple-touch-icon-precomposed" href="/favicon-152.png">
    <!-- Metro tile -->
    <meta name="msapplication-TileColor" content="#FFFFFF">
    <meta name="msapplication-TileImage" content="/favicon-260.png">

    <!-- Twitter Card and Open Graph protocol tags -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="" />
    <meta name="twitter:creator" content="" />
    <meta property="og:url" content="" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="" />

    <!-- Head JS -->
    <script src="https://use.fontawesome.com/releases/v5.0.1/js/all.js"></script>

    <script src="/dist/modernizr.min.js"></script>
    
    <title>Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights</title>

<!-- This site is optimized with the Yoast SEO plugin v11.6 - https://yoast.com/wordpress/plugins/seo/ -->
<link rel="canonical" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" />
<meta property="og:locale" content="en_GB" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights" />
<meta property="og:description" content="All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels" />
<meta property="og:url" content="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" />
<meta property="og:site_name" content="preLights" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:description" content="All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels" />
<meta name="twitter:title" content="Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights" />
<script type='application/ld+json' class='yoast-schema-graph yoast-schema-graph--main'>{"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://prelights.biologists.com/#website","url":"https://prelights.biologists.com/","name":"preLights","potentialAction":{"@type":"SearchAction","target":"https://prelights.biologists.com/?s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"WebPage","@id":"https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/#webpage","url":"https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/","inLanguage":"en-GB","name":"Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights","isPartOf":{"@id":"https://prelights.biologists.com/#website"},"datePublished":"2021-06-04T07:26:28+00:00","dateModified":"2021-06-04T07:26:28+00:00"}]}</script>
<!-- / Yoast SEO plugin. -->

<link rel='dns-prefetch' href='//s0.wp.com' />
<link rel='dns-prefetch' href='//www.google.com' />
<link rel='dns-prefetch' href='//s.w.org' />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Feed" href="https://prelights.biologists.com/feed/" />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Comments Feed" href="https://prelights.biologists.com/comments/feed/" />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development Comments Feed" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/feed/" />
		<script type="text/javascript">
			window._wpemojiSettings = {"baseUrl":"https:\/\/s.w.org\/images\/core\/emoji\/11\/72x72\/","ext":".png","svgUrl":"https:\/\/s.w.org\/images\/core\/emoji\/11\/svg\/","svgExt":".svg","source":{"concatemoji":"https:\/\/prelights.biologists.com\/wp-includes\/js\/wp-emoji-release.min.js?ver=4.9.18"}};
			!function(e,a,t){var n,r,o,i=a.createElement("canvas"),p=i.getContext&&i.getContext("2d");function s(e,t){var a=String.fromCharCode;p.clearRect(0,0,i.width,i.height),p.fillText(a.apply(this,e),0,0);e=i.toDataURL();return p.clearRect(0,0,i.width,i.height),p.fillText(a.apply(this,t),0,0),e===i.toDataURL()}function c(e){var t=a.createElement("script");t.src=e,t.defer=t.type="text/javascript",a.getElementsByTagName("head")[0].appendChild(t)}for(o=Array("flag","emoji"),t.supports={everything:!0,everythingExceptFlag:!0},r=0;r<o.length;r++)t.supports[o[r]]=function(e){if(!p||!p.fillText)return!1;switch(p.textBaseline="top",p.font="600 32px Arial",e){case"flag":return s([55356,56826,55356,56819],[55356,56826,8203,55356,56819])?!1:!s([55356,57332,56128,56423,56128,56418,56128,56421,56128,56430,56128,56423,56128,56447],[55356,57332,8203,56128,56423,8203,56128,56418,8203,56128,56421,8203,56128,56430,8203,56128,56423,8203,56128,56447]);case"emoji":return!s([55358,56760,9792,65039],[55358,56760,8203,9792,65039])}return!1}(o[r]),t.supports.everything=t.supports.everything&&t.supports[o[r]],"flag"!==o[r]&&(t.supports.everythingExceptFlag=t.supports.everythingExceptFlag&&t.supports[o[r]]);t.supports.everythingExceptFlag=t.supports.everythingExceptFlag&&!t.supports.flag,t.DOMReady=!1,t.readyCallback=function(){t.DOMReady=!0},t.supports.everything||(n=function(){t.readyCallback()},a.addEventListener?(a.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)):(e.attachEvent("onload",n),a.attachEvent("onreadystatechange",function(){"complete"===a.readyState&&t.readyCallback()})),(n=t.source||{}).concatemoji?c(n.concatemoji):n.wpemoji&&n.twemoji&&(c(n.twemoji),c(n.wpemoji)))}(window,document,window._wpemojiSettings);
		</script>
		<style type="text/css">
img.wp-smiley,
img.emoji {
	display: inline !important;
	border: none !important;
	box-shadow: none !important;
	height: 1em !important;
	width: 1em !important;
	margin: 0 .07em !important;
	vertical-align: -0.1em !important;
	background: none !important;
	padding: 0 !important;
}
</style>
<link rel='stylesheet' id='user-registration-css-css'  href='https://prelights.biologists.com/wp-content/plugins/cobpph-registration/user-registration.css?v=1604931223&#038;ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='cld-font-awesome-css'  href='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/css/fontawesome/css/all.min.css?ver=1.1.1' type='text/css' media='all' />
<link rel='stylesheet' id='cld-frontend-css'  href='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/css/cld-frontend.css?ver=1.1.1' type='text/css' media='all' />
<link rel='stylesheet' id='contact-form-7-css'  href='https://prelights.biologists.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.0.5' type='text/css' media='all' />
<link rel='stylesheet' id='wprc-style-css'  href='https://prelights.biologists.com/wp-content/plugins/report-content/static/css/styles.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='wp-postratings-css'  href='https://prelights.biologists.com/wp-content/plugins/wp-postratings/css/postratings-css.css?ver=1.89' type='text/css' media='all' />
<link rel='stylesheet' id='wpt-twitter-feed-css'  href='https://prelights.biologists.com/wp-content/plugins/wp-to-twitter/css/twitter-feed.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='jquery-ui-css-css'  href='https://prelights.biologists.com/wp-content/themes/thecobpph/vendor/jquery-ui-1.12.1.custom-datepicker/jquery-ui.min.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='dashicons-css'  href='https://prelights.biologists.com/wp-includes/css/dashicons.min.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='social-logos-css'  href='https://prelights.biologists.com/wp-content/plugins/jetpack/_inc/social-logos/social-logos.min.css?ver=1' type='text/css' media='all' />
<link rel='stylesheet' id='jetpack_css-css'  href='https://prelights.biologists.com/wp-content/plugins/jetpack/css/jetpack.css?ver=6.7.2' type='text/css' media='all' />
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/jquery.js?ver=1.12.4'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var _zxcvbnSettings = {"src":"https:\/\/prelights.biologists.com\/wp-includes\/js\/zxcvbn.min.js"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/zxcvbn-async.min.js?ver=1.0'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/cobpph-registration/user-registration.js?v=1604931223&#038;ver=4.9.18'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/themes/thecobpph/js/report_content_override.js?ver=4.9.18'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var cld_js_object = {"admin_ajax_url":"https:\/\/prelights.biologists.com\/wp-admin\/admin-ajax.php","admin_ajax_nonce":"794abb0710"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/js/cld-frontend.js?ver=1.1.1'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var wprcajaxhandler = {"ajaxurl":"https:\/\/prelights.biologists.com\/wp-admin\/admin-ajax.php"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/report-content/static/js/scripts.js?ver=4.9.18'></script>
<script type='text/javascript' src='https://www.google.com/recaptcha/api.js?ver=4.9.18'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var SafeCommentsAjax = {"ajaxurl":"https:\/\/prelights.biologists.com\/wp-admin\/admin-ajax.php"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/safe-report-comments/js/ajax.js?ver=4.9.18'></script>
<link rel='https://api.w.org/' href='https://prelights.biologists.com/wp-json/' />
<link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://prelights.biologists.com/xmlrpc.php?rsd" />
<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="https://prelights.biologists.com/wp-includes/wlwmanifest.xml" /> 
<link rel='shortlink' href='https://prelights.biologists.com/?p=29382' />
<link rel="alternate" type="application/json+oembed" href="https://prelights.biologists.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fprelights.biologists.com%2Fhighlights%2Fcoronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development%2F" />
<link rel="alternate" type="text/xml+oembed" href="https://prelights.biologists.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fprelights.biologists.com%2Fhighlights%2Fcoronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development%2F&#038;format=xml" />
<style>a.cld-like-dislike-trigger {color: #ffffff;}span.cld-count-wrap {color: #ffffff;}</style><style type='text/css'>img#wpstats{display:none}</style>		<style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>
		
    
    
</head>
<!-- NAVBAR
================================================== -->
<body>
<div class="main-wrapper">

<div class="navbar-wrapper container">
    <div class="navbar-inner">
        <nav class="navbar navbar-inverse navbar-static-top">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div id="navbar" class="collapse navbar-collapse"><ul id="menu-primary-navigation" class="nav navbar-nav"><li id="menu-item-50" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-50"><a title="Home" href="/" style="width:125px;"><svg class="svg-inline--fa fa-home fa-w-18" aria-hidden="true" style="max-width:1.125em;margin-right:10px;float:left;" data-fa-processed="" data-prefix="fas" data-icon="home" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M488 312.7V456c0 13.3-10.7 24-24 24H348c-6.6 0-12-5.4-12-12V356c0-6.6-5.4-12-12-12h-72c-6.6 0-12 5.4-12 12v112c0 6.6-5.4 12-12 12H112c-13.3 0-24-10.7-24-24V312.7c0-3.6 1.6-7 4.4-9.3l188-154.8c4.4-3.6 10.8-3.6 15.3 0l188 154.8c2.7 2.3 4.3 5.7 4.3 9.3zm83.6-60.9L488 182.9V44.4c0-6.6-5.4-12-12-12h-56c-6.6 0-12 5.4-12 12V117l-89.5-73.7c-17.7-14.6-43.3-14.6-61 0L4.4 251.8c-5.1 4.2-5.8 11.8-1.6 16.9l25.5 31c4.2 5.1 11.8 5.8 16.9 1.6l235.2-193.7c4.4-3.6 10.8-3.6 15.3 0l235.2 193.7c5.1 4.2 12.7 3.5 16.9-1.6l25.5-31c4.2-5.2 3.4-12.7-1.7-16.9z"></path></svg>Home</a></li>
<li id="menu-item-271" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-271 dropdown"><a title="About" href="#" data-toggle="dropdown" class="dropdown-toggle" aria-haspopup="true">About <span class="caret"></span></a>
<ul role="menu" class=" dropdown-menu">
	<li id="menu-item-28791" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28791"><a title="About us" href="https://prelights.biologists.com/about-us/">About us</a></li>
	<li id="menu-item-28792" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28792"><a title="Frequently asked questions" href="https://prelights.biologists.com/frequently-asked-questions/">Frequently asked questions</a></li>
	<li id="menu-item-28940" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28940"><a title="Scientific Advisory Board" href="https://prelights.biologists.com/scientific-advisory-board/">Scientific Advisory Board</a></li>
</ul>
</li>
<li id="menu-item-54" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-54"><a title="Community" href="/community/">Community</a></li>
<li id="menu-item-72" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-72"><a title="preLight posts" href="/highlights/">preLight posts</a></li>
<li id="menu-item-10773" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-10773 dropdown"><a title="preLists" href="#" data-toggle="dropdown" class="dropdown-toggle" aria-haspopup="true">preLists <span class="caret"></span></a>
<ul role="menu" class=" dropdown-menu">
	<li id="menu-item-28804" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-28804"><a title="What are preLists?" href="https://prelights.biologists.com/what-are-prelists/">What are preLists?</a></li>
	<li id="menu-item-28793" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-28793"><a title="Conference related preLists" href="/prelists/?related_to_conference=true">Conference related preLists</a></li>
	<li id="menu-item-28794" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-28794"><a title="All preLists" href="/prelists/">All preLists</a></li>
</ul>
</li>
<li id="menu-item-289" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-289 dropdown"><a title="News" href="#" data-toggle="dropdown" class="dropdown-toggle" aria-haspopup="true">News <span class="caret"></span></a>
<ul role="menu" class=" dropdown-menu">
	<li id="menu-item-28796" class="menu-item menu-item-type-taxonomy menu-item-object-news_category menu-item-28796"><a title="General news" href="https://prelights.biologists.com/news-category/general/">General news</a></li>
	<li id="menu-item-28797" class="menu-item menu-item-type-taxonomy menu-item-object-news_category menu-item-28797"><a title="Interviews" href="https://prelights.biologists.com/news-category/interviews/">Interviews</a></li>
	<li id="menu-item-28800" class="menu-item menu-item-type-taxonomy menu-item-object-news_category menu-item-28800"><a title="Preprints by preLighters" href="https://prelights.biologists.com/news-category/preprints-by-prelighters/">Preprints by preLighters</a></li>
	<li id="menu-item-28798" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-28798"><a title="All news" href="/news/">All news</a></li>
</ul>
</li>
<li id="menu-item-224" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-224"><a title="Contact us" href="https://prelights.biologists.com/contact-us/">Contact us</a></li>
<li><a href="https://prelights.biologists.com/wp-login.php?redirect_to=https%3A%2F%2Fprelights.biologists.com%2Fwp-admin%2F"><span class="fas fa-lock" aria-hidden="true"></span> Login</a></li><li><a href="/wp-login.php?action=register"><span class="fas fa-user" aria-hidden="true"></span> Register</a></li></ul></div>        </nav>
    </div>
</div>

<header class="header">

    <div class="sisters overlay">
    <div class="overlay__inner container-sm container">

        <a href="http://www.biologists.com"><img src="/dist/images/CoB-full.svg" class="img-responsive mh--120 center-block" /></a>

        <br/>

        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-md-3">

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://dev.biologists.org"><img src="https://prelights.biologists.com/resized/190/dev.biologists.org/current-issue/cover.gif" class="img-responsive mh--160 centred" /></a>
                </div>
            </div>

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://jcs.biologists.org"><img src="https://prelights.biologists.com/resized/190/jcs.biologists.org/current-issue/cover.gif" class="img-responsive mh--160 centred" /></a>
                </div>
            </div>

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://jeb.biologists.org"><img src="https://prelights.biologists.com/resized/190/jeb.biologists.org/current-issue/cover.gif" class="img-responsive mh--160 centred" /></a>
                </div>
            </div>

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://dmm.biologists.org"><img src="https://prelights.biologists.com/resized/190/dmm.biologists.org/current-issue/cover.gif" class="img-responsive mh--160 centred" /></a>
                </div>
            </div>

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://bio.biologists.org"><img src="https://prelights.biologists.com/resized/190/bio.biologists.org/current-issue/cover.gif" class="img-responsive mh--160 centred" /></a>
                </div>
            </div>

            <div class="block-grid-item">
                <div class="grid-item--background">
                    <a href="http://thenode.biologists.com"><img src="https://prelights.biologists.com/wp-content/themes/thecobpph/assets/images/the-node-logo.png" class="img-responsive mh--120 mt-50 centred" /></a>
                </div>
            </div>
        </div>

            </div>

    <div class="overlay__button overlay__button--right" data-js="sisters-toggle-button">
        <span class="fas fa-times" aria-hidden="true"></span> <span>Close</span>
    </div>
</div>
    <div class="container header__top">

        <div class="header__logo">
            <a href="/"><img src="/dist/images/preLights.svg" /></a>
            <div class="header__logo__title text-seperator">Preprint highlights, selected by the biological community</div>
        </div>

        <div class="header__attribution hidden-xs" data-js="sisters-toggle-button">
            <img src="/dist/images/CoB.svg" />
        </div>
    </div>

    <div class="container">
        <div class="row">

            <div class="header__search__button" data-js="filter-toggle-button">
                <span class="fas fa-search" aria-hidden="true"></span>
            </div>

        </div>
    </div>

    <div class="header__menu overlay">

        <div class="overlay__button overlay__button--right" data-js="menu-toggle-button">
            <span class="fas fa-times" aria-hidden="true"></span> <span>Close</span>
        </div>

        <div class="overlay__inner">
             <div id="navbar" class="container container-md"><ul id="menu-primary-navigation-1" class="header__menu__list block-grid-sm-1 block-grid-md-2"><li class="block-grid-item"><div class="header__menu__item"><a href="/" class="header__menu__link">Home</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/about-us/" class="header__menu__link">About</a></div></li><ul class="header__menu__list block-grid-sm-1 block-grid-md-2"><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/about-us/" class="header__menu__link">About us</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/frequently-asked-questions/" class="header__menu__link">Frequently asked questions</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/scientific-advisory-board/" class="header__menu__link">Scientific Advisory Board</a></div></li></li></ul></li><li class="block-grid-item"><div class="header__menu__item"><a href="/community/" class="header__menu__link">Community</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="/highlights/" class="header__menu__link">preLight posts</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="/prelists/" class="header__menu__link">preLists</a></div></li><ul class="header__menu__list block-grid-sm-1 block-grid-md-2"><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/what-are-prelists/" class="header__menu__link">What are preLists?</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="/prelists/?related_to_conference=true" class="header__menu__link">Conference related preLists</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="/prelists/" class="header__menu__link">All preLists</a></div></li></li></ul></li><li class="block-grid-item"><div class="header__menu__item"><a href="/news/" class="header__menu__link">News</a></div></li><ul class="header__menu__list block-grid-sm-1 block-grid-md-2"><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/news-category/general/" class="header__menu__link">General news</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/news-category/interviews/" class="header__menu__link">Interviews</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/news-category/preprints-by-prelighters/" class="header__menu__link">Preprints by preLighters</a></div></li></li><li class="block-grid-item"><div class="header__menu__item"><a href="/news/" class="header__menu__link">All news</a></div></li></li></ul></li><li class="block-grid-item"><div class="header__menu__item"><a href="https://prelights.biologists.com/contact-us/" class="header__menu__link">Contact us</a></div></li></li><li><a href="https://prelights.biologists.com/wp-login.php?redirect_to=https%3A%2F%2Fprelights.biologists.com%2Fwp-admin%2F"><span class="fas fa-lock" aria-hidden="true"></span> Login</a></li><li><a href="/wp-login.php?action=register"><span class="fas fa-user" aria-hidden="true"></span> Register</a></li></ul></div>
            <div class="row social-media">
    <div class="col-xs-12">
        <div class="social-media__item"><a href="https://www.facebook.com/preLights/" target="_blank"><span class="fab fa-facebook-square"></span></a></div>
        <div class="social-media__item"><a href="https://twitter.com/preLights" target="_blank"><span class="fab fa-twitter"></span></a></div>
        <div class="social-media__item"><a href="https://www.youtube.com/user/CompanyofBiologists" target="_blank"><span class="fab fa-youtube"></span></a></div>
    </div>
</div>
            <h3 class="text-center">preLights is supported by…</h3>
            <img src="/dist/images/CoB-full.svg" class="img-responsive mh--80 center-block" />

        </div>
    </div>
</header>



    <div class="related-content">
        <p><a id="related-content-highlights" class="button button--blue float-right" href="#related-highlights">Related posts</a></p>
        <p><a id="related-content-prelists" class="button button--primary float-right" href="#related-prelists">Related preLists</a></p>
    </div>



<div class="container">


    <div class="row">
        <div class="col-md-12 col-lg-8 col-lg-offset-2">
                        <h1 class="mb--16">Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development</h1>
            <p class="contributor__author"><a href="http://orcid.org/0000-0003-3014-1915" target="_blank"><span class="contributor__orchid-id"></span></a>Ragini Phansalkar, Josephine Krieger, Mingming Zhao, Sai Saroja Kolluru, Robert C. Jones, Stephen R Quake, Irving Weissman, Daniel Bernstein, Virginia D. Winn, Gaetano D’Amato, Kristy Red-Horse </p>
            <p class="preprint-details__date">Preprint posted on April 26, 2021 <a href="https://www.biorxiv.org/content/10.1101/2021.04.25.441380v1" target="_blank">https://www.biorxiv.org/content/10.1101/2021.04.25.441380v1</a></p>

                            </p>
        </div>
    </div>
            </div>


<div class="container mt--24">
    <div class="row">
        <div class="col-md-12 col-lg-8 col-lg-offset-2">
            <div class="well well--small">
                <div class="row row-flex align-middle">
                    <div class="col-xs-12 col-sm-9 excerpt"><p>All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels</p>
                        <span class="text-label collapse-top collapse-bottom"><span>Selected by</span></span>
                        <span class="hero-panel__title"><a href='https://prelights.biologists.com/profiles/yen-tran/'>Yen Tran</a>, <a href='https://prelights.biologists.com/profiles/osvaldo-contreras/'>Osvaldo Contreras</a></span>
                    </div>
                    <div class="col-xs-12 col-sm-3">
                                                <a href='https://prelights.biologists.com/profiles/yen-tran/'><img src="https://prelights.biologists.com/wp-content/uploads/2021/06/1614508760169-150x150.jpg" class="contributor__avatar collapse-bottom contributor__avatar--highlight img-responsive img-circle center-block" /></a>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>

<div class="container mt--16">
    <div class="row">
        <div class="col-md-12 col-lg-8 col-lg-offset-2">
                            <p class="preprint-details__categories">Categories:
                <a href="/highlights-category/bioinformatics">bioinformatics</a>, <a href="/highlights-category/cell-biology">cell biology</a>, <a href="/highlights-category/developmental-biology">developmental biology</a>            </p>
                        </div>
    </div>
</div>

<!-- When this point is reached, the tab buttons appear for related content -->
<div id="related-content-trigger-point"></div>

<div class="container">
    <div class="row highlight">
        <div class="col-md-12 col-lg-8 col-lg-offset-2 preprint-details">
            <h3><b>Background</b></h3>
<p><span style="font-weight: 400">The coronary arteries branch along the coronary groove of the heart and supply oxygenated blood to the myocardium and heart cells. Owing to their essential function, coronary blood vessel formation and maintenance regulate the normal functions of the cardiac muscle. When this “goes wrong,” for example, in diseased coronary blood vessels, cardiac function is severely affected. Coronary diseases (also known as coronary artery disease, or CAD) are rising in the industrialized world, representing the most common cause of heart disease in the United States. Because CAD severely impacts the quality of life of patients and has a significant socioeconomic impact (WHO), understanding the underlying mechanisms of blood vessel development and regulation in homeostasis and disease could open roads for novel and efficient medical applications.</span></p>
<p><b>How do coronary vessels develop? </b><span style="font-weight: 400">The formation of coronary vessels requires two principal cellular sources: sinus venosus (SV)- and endocardium (Endo)-derived endothelial cells (Lupu et al.). The sinus venosus is the inflow tract of the developing heart, and the endocardium is the layer lining inside the cardiac ventricles. At embryonic day E11.5, endothelial cells from SV migrate caudally and contribute to the vessel network in the outer myocardial wall. Conversely, endocardial cells extrapolate inside out and contribute to the vessels network of inner myocardial walls and the septum. Later, the two networks unite and remodel into mature capillaries, arteries and veins before connecting with the aorta and carrying blood flow. Previously, Su et al. used single-cell RNA sequencing (scRNA-seq) to characterize the transcriptomes of SV-derived endothelial cells. However, a direct comparison between Endo- and SV- derived ECs during coronary vessel formation has not been explored.</span></p>
<blockquote><p><b>What is the biological question addressed in this preprint, and why is it important? </b><span style="font-weight: 400">In an exciting new preprint, Phansalkar et al. take advantage of scRNA-seq combined with endothelial cell lineage-tracing to explore for the first time the dual origins of coronary blood vessels during mouse and human development.</span></p></blockquote>
<p>&nbsp;</p>
<h3><b>Key findings</b></h3>
<p><span style="font-weight: 400">To address the origin(s) of endothelial cells during coronary vessel formation, </span><span style="font-weight: 400">Phansalkar</span><span style="font-weight: 400"> and colleagues integrated single-cell RNA sequencing with lineage tracing of the endocardium (Endo) and sinus venosus (SV) derived endothelial cells (ECs) using </span><i><span style="font-weight: 400">Bmx</span></i><span style="font-weight: 400">CreER and </span><i><span style="font-weight: 400">Apj</span></i><span style="font-weight: 400">CreER mice, respectively. The authors collected ECs from two embryonic (E12 and E17.5) and adult stages (8 weeks of age). The single-cell data captured most endothelial cell types, and as expected, the proportion of each cell type changed over the developmental course. The E12 coronary vessels contained two capillary plexus (Cap1, Cap2) and one pre-artery (pre-Art) cluster. Later in development, E17.5 coronary ECs resolved two capillaries (Cap1 and Cap2), two arteries (Art1 &amp; Art2), and one vein cluster. The authors found one artery, one vein, and two capillary clusters in adult coronary ECs.</span></p>
<p><span style="font-weight: 400">Further characterization of the cell lineages of coronary ECs suggests that the origins and heterogeneity of SV and Endo fade over time. At E12, the Cap1 subpopulation shared molecular signatures with Endo, whereas the Cap2 subpopulation was enriched with SV marker genes. However, these patterns are not preserved at E17.5 and in adults. Remarkably, although E17.5 capillary clusters did not retain their origin&#8217;s signature, they were segregated by their location within the heart. Cap2 cells (Kcne3- and Car4+) are associated with the left and right ventricle free walls and dorsal side. Cap1 cells (Kcne3+ and Car4) are located in the septum and ventral side.</span></p>
<p><span style="font-weight: 400">Interestingly, differential gene expression of Cap1 and Cap2 reflected the distinct features of cardiac regions. Cap1 cells had high expression of hypoxia-related genes and tip markers, implying that the septum region may be hypoxic and require new blood vessel formation. In addition, Cap2 cells highly expressed shear stress-induced genes, suggesting that this region experiences a higher blood flow rate. Furthermore, most of the Cap1 cells in the septum and ventral areas are tdTomato+, indicating these cells derive from Endo lineage. In the adult, both lineages- and location-based cell heterogeneity disappeared.</span></p>
<p><span style="font-weight: 400">Owing to Endo- and SV-derived endothelial cells having similar transcriptomic profiles in adult hearts, the authors sought to understand whether the cellular properties of Endo- and SV-derived ECs change under injury. Although endothelial cells proliferate at high rates, no significant differences were observed in the S-phase progression among both endothelial cell lineages, as evaluated by the incorporation of a nucleotide analog EdU. These findings suggest that endothelial lineage does not influence cell proliferation. In this context, it would be interesting to see the scRNA-seq following cardiac injury using the </span><i><span style="font-weight: 400">Bmx</span></i><span style="font-weight: 400"> lineage-tracing in adult mice.</span></p>
<p><span style="font-weight: 400">Next, using scRNA-seq analyses, the authors explored whether mouse and human coronary vessels share similar transcriptomic features, cellular states, and trajectories at different developmental stages. Smart-seq2 of two prominent human blood vessel fractions (CD31+ and CD36+) were combined and compared to the mouse scRNA-seq data through Label Transfer analysis. These results found shared developmental cues and endothelial cell lineages and states between the two species. Similar findings were found for the capillary-to-artery transition, as mouse endothelial cells mapped to the different human artery subclusters described by the authors. Remarkably, trajectory analyses of murine arterial cellular states suggested the progression of a single immature state -not found in adult artery endothelial cells- into two continuous and mature states, which also exist in the adult human heart. Using trajectory analysis, the authors also suggested that capillary endothelial cells give rise to arteries, as previously described in mouse heart development. The capillary-to-artery transition could be happening simultaneously at two different heart regions, reinforcing their previous findings concerning the defining role of heart location or microenvironment on blood vessel formation. However, detailed spatiotemporal studies of these cell subpopulations should corroborate these findings.</span></p>
<p><span style="font-weight: 400">Motivated by the fact that coronary artery disease is a significant cause of death in the industrialized world, the authors closely analyzed the transcriptomes of the three different arterial cells during development, aiming to find potential genes that could shed light on disease progression and biomarkers. They found striking differences in their maturation states that correlated with differential gene expression and progression of artery arborization. In addition, their findings also highlighted the potential role of newly discovered transcription factors in Art subpopulations, including PRDM16, GATA2, and IRF6. Human-enriched genes involved in neurotransmission (e.g., GABA and Glutamate receptors) were not expressed in the mouse. The latter findings could open the way into potential new genes to target coronary diseases.</span></p>
<p>&nbsp;</p>
<h3><b>What we liked about this preprint</b></h3>
<p><span style="font-weight: 400">Most bioinformatic analyses of scRNA-seq data focus on the divergence state of cells during commitment and differentiation. Interestingly, here the authors use single-cell analysis and lineage tracing to address an opposite process, called </span><b>convergent differentiation</b><span style="font-weight: 400">. In this context, two or more lineage origins contribute to the same endpoint cell state. Here, the authors addressed the converging state of endocardium and sinus venous-derived ECs onto capillary plexus. They found that the descendant capillary cells &#8216;remember&#8217; their origins at the beginning of convergence but lose their origin memories during the converge trajectory and adopt location-based molecular properties when residing in different cardiac regions. By the end of this process, all capillary cells become indistinguishable by origin and location.</span></p>
<p><span style="font-weight: 400">In conclusion, this preprint provides complete mouse and human single-cell datasets from the initiation of coronary vessel formation at embryonic stages to adulthood. The similarities between mouse and human coronary ECs single-cell data validate the usability of the mouse to understand human blood vessel development and speculatively might provide therapeutic windows to the high prevalence of coronary artery disease.</span></p>
<p>&nbsp;</p>
<h3><b>Future directions and questions to the authors</b></h3>
<ol>
<li style="font-weight: 400"><span style="font-weight: 400">Intriguingly, the author chose 10X Genomics for coronary ECs at embryonic days E12 and E17.5 and Smart-seq2 for the remaining data. Why these different single-cell technologies? Given that Smart-seq2 captures full-length mRNA while 10X Genomics uses a 5’ or 3’-tag sequencing method, could their parallel use introduce bias in the number of genes recovered and subsequent comparisons?</span></li>
<li style="font-weight: 400"><span style="font-weight: 400">The authors suggested that coronary capillary clusters at E12 are distinguished based on either SV- or Endo-derived gene signatures. What criteria did you use for selecting these gene signatures for the classification of Cap1 and Cap2?</span></li>
<li style="font-weight: 400"><span style="font-weight: 400">In figure 3g, the authors quantified the number of Car4+ cells associated with tdTomato+ lineage and distinct cardiac regions at E17.5. The results clearly show an enrichment of tdTomato+/Car4- in the septum and ventral cardiac areas, whereas this location-based heterogeneity is lost in the adult. Do you have similar quantitative results in the adult?</span></li>
<li style="font-weight: 400"><span style="font-weight: 400">Are there any differences in the proliferative or cell cycle progression capabilities of endothelial cell lineages (Endo- vs SV-derived) during heart development?</span></li>
<li style="font-weight: 400"><span style="font-weight: 400">What do the authors think about the existence of different subclusters of immature (one) and mature (two) arteries with the absence or presence of smooth muscle? At what extent endothelial cell developmental trajectories are determined by smooth muscle cells or vice versa?</span></li>
</ol>
<p><b> </b></p>
<h3><b>References</b></h3>
<p><span style="font-weight: 400">Lupu, IE., De Val, S. &amp; Smart, N. Coronary vessel formation in development and disease: mechanisms and insights for therapy. Nat Rev Cardiol 17, 790–806 (2020).</span><a href="https://doi.org/10.1038/s41569-020-0400-1"> <span style="font-weight: 400">https://doi.org/10.1038/s41569-020-0400-1</span></a></p>
<p><span style="font-weight: 400">Su, T., Stanley, G., Sinha, R. et al. Single-cell analysis of early progenitor cells that build coronary arteries. Nature 559, 356–362 (2018).</span><a href="https://doi.org/10.1038/s41586-018-0288-7"> <span style="font-weight: 400">https://doi.org/10.1038/s41586-018-0288-7</span></a></p>
<p><span style="font-weight: 400">World Health Organization (WHO):</span><a href="https://www.who.int/en/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)"> <span style="font-weight: 400">https://www.who.int/en/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)</span></a><span style="font-weight: 400">. Accessed June the 3</span><span style="font-weight: 400">rd</span><span style="font-weight: 400">, 2021.</span></p>

                <p class="preprint-details__tags">Tags:
                    <a href="/?s=cell differentiation&filter_type=highlight">cell differentiation</a>, <a href="/?s=coronary artery disease&filter_type=highlight">coronary artery disease</a>, <a href="/?s=coronary vessels&filter_type=highlight">coronary vessels</a>, <a href="/?s=development&filter_type=highlight">development</a>, <a href="/?s=endothelial cells&filter_type=highlight">endothelial cells</a>, <a href="/?s=single-cell rnaseq&filter_type=highlight">single-cell rnaseq</a>                </p>
                                <p class="preprint-details__postedon">Posted on: 4th June 2021                    </p>
                        <div class="sharedaddy sd-sharing-enabled"><div class="robots-nocontent sd-block sd-social sd-social-icon-text sd-sharing"><h3 class="sd-title">Share this:</h3><div class="sd-content"><ul><li class="share-twitter"><a rel="nofollow noopener noreferrer" data-shared="sharing-twitter-29382" class="share-twitter sd-button share-icon" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/?share=twitter" target="_blank" title="Click to share on Twitter"><span>Twitter</span></a></li><li class="share-facebook"><a rel="nofollow noopener noreferrer" data-shared="sharing-facebook-29382" class="share-facebook sd-button share-icon" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/?share=facebook" target="_blank" title="Click to share on Facebook"><span>Facebook</span></a></li><li class="share-end"></li></ul></div></div></div>                        <a href="https://www.biorxiv.org/content/10.1101/2021.04.25.441380v1" class="button button--blue" target="_blank"><span
                                class="fas fa-share-square"></span> Read preprint</a>
                                        <span id="post-ratings-29382" class="post-ratings" data-nonce="8f6c02b421"><img id="rating_29382_1" src="https://prelights.biologists.com/wp-content/plugins/wp-postratings/images/cob_thumbs/rating_1_off.png" alt="" title="" onmouseover="current_rating(29382, 1, '');" onmouseout="ratings_off(0, 0, 0);" onclick="rate_post();" onkeypress="rate_post();" style="cursor: pointer; border: 0px;" /> (No Ratings Yet)<br /><span class="post-ratings-text" id="ratings_29382_text"></span></span><p></p><div class="wprc-container blue-colorscheme">
	<button type="button" class="wprc-switch">Report Content</button>
	<div class="wprc-content">
		<div class="wprc-message">
		</div>
		<div class="wprc-form">
							<div class="left-section">
					<ul>
						<li class="list-item-reason">
							<label for="input-reason-29382">
								Issue:								<span class="required-sign">*</span>
							</label><br/>
							<select id="input-reason-29382" class="input-reason">
																	<option>Copyright infringement
</option>
																	<option>Spam
</option>
																	<option>Inappropriate content
</option>
																	<option>Broken links</option>
															</select>
						</li>
						<li class="list-item-name">
															<label for="input-name-29382">
									Your Name:																			<span class="required-sign">*</span>
																	</label><br/>
								<input type="text" id="input-name-29382"
								       class="input-name wprc-input"/>
													</li>
						<li class="list-item-email">
															<label for="input-email-29382">
									Your Email:																			<span class="required-sign">*</span>
																	</label><br/>
								<input type="text" id="input-email-29382"
								       class="input-email wprc-input"/>
													</li>
					</ul>
				</div>
				<div class="right-section">
					<ul>
						<li class="list-item-details">
															<label for="input-details-29382">
									Details:																			<span class="required-sign">*</span>
																	</label><br/>
								<textarea id="input-details-29382"
								          class="input-details wprc-input"></textarea>
													</li>
					</ul>
				</div>
				<div class="clear"></div>
				<input type="hidden" class="post-id" value="29382">
				<button type="button" class="wprc-submit">Submit Report</button>
				<img class="loading-img" style="display:none;"
				     src="https://prelights.biologists.com/wp-content/plugins/report-content/static/img/loading.gif"/>
					</div>
	</div>
</div>
                    </div>
    </div>
</div>




<div id="comment-form-container" class=" stripe--padding stripe--dark-grey">
    <div class="container">
        <div class="row">
            <div class="col-md-12 col-lg-8 col-lg-offset-2">


	<div id="respond" class="comment-respond">
		<h3 id="reply-title" class="comment-reply-title">Have your say <small><a rel="nofollow" id="cancel-comment-reply-link" href="/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/#respond" style="display:none;">Cancel reply</a></small></h3>			<form action="https://prelights.biologists.com/wp-comments-post.php" method="post" id="commentform" class="comment-form" novalidate>
				<p class="comment-notes"><span id="email-notes">Your email address will not be published.</span> Required fields are marked <span class="required">*</span></p><p class="comment-form-comment"><label for="comment">Comment *</label> <div class="form-field"><textarea id="comment" class="form-field--text" name="comment" cols="45" rows="8" maxlength="65525" aria-required="true" required="required"></textarea></div></p><p class="comment-form-author"><label for="author">Name <span class="required">*</span></label> <div class="form-field"><input id="author" name="author" type="text" value="" size="30" maxlength="245" aria-required='true' required='required' class="form-field--text" /></div></p>
<p class="comment-form-email"><label for="email">Email <span class="required">*</span></label> <div class="form-field"><input id="email" name="email" type="email" value="" size="30" maxlength="100" aria-describedby="email-notes" aria-required='true' required='required' class="form-field--text" /></div></p>
<div class="g-recaptcha" data-sitekey="6Le3XUMUAAAAABFaleEV-1r7KtePVYnTU64qN_sY"></div><p class="form-submit"><button name="submit" id="submit" class="button button--blue" type="submit"><span class="fas fa-comment"></span> Add your comment</button> <input type='hidden' name='comment_post_ID' value='29382' id='comment_post_ID' />
<input type='hidden' name='comment_parent' id='comment_parent' value='0' />
</p><p style="display: none;"><input type="hidden" id="akismet_comment_nonce" name="akismet_comment_nonce" value="0042290f42" /></p><p style="display: none;"><input type="hidden" id="ak_js" name="ak_js" value="66"/></p>			</form>
			</div><!-- #respond -->
	<p class="akismet_comment_form_privacy_notice">This site uses Akismet to reduce spam. <a href="https://akismet.com/privacy/" target="_blank" rel="nofollow noopener">Learn how your comment data is processed</a>.</p>
            </div>
        </div>
    </div>
</div>



    <div class="cta__panel stripe--green stripe"  style='margin-top:0px;' >
        <div class="container">
            <div class="row">
                <div class="col-xs-12 text-center">

                    <h2 class="cta__panel__title">Sign up to customise the site to your preferences and to receive alerts</h2>

                                                    <a  href="https://prelights.biologists.com/wp-login.php?action=register" class="button button--white">Register here</a>
                                        </div>
            </div>
        </div>
    </div>

<a id="related-highlights"></a>
<div class="container">
    <div class="row">
                            <div class="container">
                            <h2 class="title">Also in the <span class="search-keyword">bioinformatics</span>
                    category:</h2>
            
            <div class="row">
            <div class="col-xs-12">
                                        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-3">
                            
                            <a href="https://prelights.biologists.com/highlights/deepimagetranslator-a-free-user-friendly-graphical-interface-for-image-translation-using-deep-learning-and-its-applications-in-3d-ct-image-analysis/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">DeepImageTranslator: a free, user-friendly graphical interface for image translation using deep-learning and its applications in 3D CT image analysis</h2>
            <p class="contributor__author">Run Zhou Ye, Christophe Noll, Gabriel Richard, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Afonso Mendes</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/acorde-unraveling-functionally-interpretable-networks-of-isoform-co-usage-from-single-cell-data/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title"><em>Acorde</em>: unraveling functionally-interpretable networks of isoform co-usage from single cell data</h2>
            <p class="contributor__author">Angeles Arzalluz-Luque, Pedro Salguero, Sonia Tarazona, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Bobby Ranjan</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/repurposing-of-synaptonemal-complex-proteins-for-kinetochores-in-kinetoplastida/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">Repurposing of Synaptonemal Complex Proteins for Kinetochores in Kinetoplastida</h2>
            <p class="contributor__author">Eelco C. Tromer, Thomas A. Wemyss, Ross F. Waller, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Hiral Shah, Dey Lab</td>
                </tr>
            </table>
        </div>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
                                <div class="container">
                            <h2 class="title">Also in the <span class="search-keyword">cell biology</span>
                    category:</h2>
            
            <div class="row">
            <div class="col-xs-12">
                                        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-3">
                            
                            <a href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development</h2>
            <p class="contributor__author">Ragini Phansalkar, Josephine Krieger, Mingming Zhao, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Yen Tran, Osvaldo Contreras</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/a-cryo-et-study-of-microtubules-in-axons/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">A cryo-ET study of microtubules in axons</h2>
            <p class="contributor__author">H E Foster, C Ventura Santos, A P Carter</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Ashleigh Davey</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/an-engineered-transcriptional-reporter-of-protein-localization-identifies-regulators-of-mitochondrial-and-er-membrane-protein-trafficking-in-high-throughput-screens/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">An engineered transcriptional reporter of protein localization identifies regulators of mitochondrial and ER membrane protein trafficking in high-throughput screens</h2>
            <p class="contributor__author">Robert Coukos, David Yao, Mateo I. Sanchez, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Lorenzo Lafranchi</td>
                </tr>
            </table>
        </div>
                    <p class="contributor__comment"><span class="fas fa-comment"></span> 1</p>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
                                <div class="container">
                            <h2 class="title">Also in the <span class="search-keyword">developmental biology</span>
                    category:</h2>
            
            <div class="row">
            <div class="col-xs-12">
                                        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-3">
                            
                            <a href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development</h2>
            <p class="contributor__author">Ragini Phansalkar, Josephine Krieger, Mingming Zhao, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Yen Tran, Osvaldo Contreras</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/cyclic-nucleotide-gated-ion-channel-2-modulates-auxin-homeostasis-and-signaling/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">Cyclic Nucleotide-Gated Ion Channel 2 modulates auxin homeostasis and signaling</h2>
            <p class="contributor__author">Sonhita Chakraborty, Masatsugu Toyota, Wolfgang Moeder, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Pavithran Narayanan</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/highlights/gastruloids-as-in-vitro-models-of-embryonic-blood-development-with-spatial-and-temporal-resolution/" class="block-grid-item">
    <div class="grid-item--background">
                    <h2 class="grid-item__title">Gastruloids as <em>in vitro</em> models of embryonic blood development with spatial and temporal resolution</h2>
            <p class="contributor__author">Giuliana Rossi, Sonja Giger, Tania Hübscher, et al.</p>
                <br/></br>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">Selected by </span></td>
                    <td>Anna Meier</td>
                </tr>
            </table>
        </div>
                    <p class="contributor__comment"><span class="fas fa-comment"></span> 1</p>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
            <script type="application/javascript">
    jQuery(document).ready(function() {
        jQuery("#related-content-highlights").show();
    });
</script>
        </div>
</div>

<a id="related-prelists"></a>
<div class="container">
    <div class="row">
                            <div class="container">
                                <h2 class="title">preLists<span class="prelist-icon tooltip" data-tooltip="preLists are posts which outline a set (or list) of preprints that are interest collectively or share a common theme."><i class="fas fa-align-justify"></i></span> in the <span
                            class="search-keyword">bioinformatics</span>
                        category:</h2>
                    
            <div class="row">
            <div class="col-xs-12">
                                    <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-2">
                        
                            <a href="https://prelights.biologists.com/prelists/single-cell-biology-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Single Cell Biology 2020</h2>
        <p>A list of preprints mentioned at the Wellcome Genome Campus Single Cell Biology 2020 meeting. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/antimicrobials-discovery-clinical-use-and-development-of-resistance/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Antimicrobials: Discovery, clinical use, and development of resistance</h2>
        <p>Preprints that describe the discovery of new antimicrobials and any improvements made regarding their clinical use. Includes preprints that detail the factors affecting antimicrobial selection and the development of antimicrobial resistance.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Zhang-He Goh</td>
                </tr>
            </table>
        </div>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
                                <div class="container">
                                <h2 class="title">Also in the <span
                            class="search-keyword">cell biology</span>
                        category:</h2>
                    
            <div class="row">
            <div class="col-xs-12">
                                        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-3">
                            
                            <a href="https://prelights.biologists.com/prelists/embl-synthetic-morphogenesis-from-gene-circuits-to-tissue-architecture-2021/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EMBL Synthetic Morphogenesis: From Gene Circuits to Tissue Architecture (2021)</h2>
        <p>A list of preprints mentioned at the #EESmorphoG virtual meeting in 2021.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/fens-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">FENS 2020</h2>
        <p>A collection of preprints presented during the virtual meeting of the Federation of European Neuroscience Societies (FENS) in 2020</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Ana Dorrego-Rivas</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/planar-cell-polarity-pcp/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Planar Cell Polarity &#8211; PCP</h2>
        <p>This preList contains preprints about the latest findings on Planar Cell Polarity (PCP) in various model organisms at the molecular, cellular and tissue levels. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Ana Dorrego-Rivas</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/biomalpar-xvi-biology-and-pathology-of-the-malaria-parasite/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">BioMalPar XVI: Biology and Pathology of the Malaria Parasite</h2>
        <p>[under construction] Preprints presented at the (fully virtual) EMBL BioMalPar XVI, 17-18 May 2020 #emblmalaria</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab, Samantha Seah</td>
                </tr>
            </table>
        </div>
                    <p class="contributor__comment"><span class="fas fa-comment"></span> 1</p>
            </div>
</a><a href="https://prelights.biologists.com/prelists/cell-polarity/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Cell Polarity</h2>
        <p>Recent research from the field of cell polarity is summarized in this list of preprints.  It comprises of studies focusing on various forms of cell polarity ranging from epithelial polarity, planar cell polarity to front-to-rear polarity.   </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Yamini Ravichandran</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/tagc-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">TAGC 2020</h2>
        <p>Preprints recently presented at the virtual Allied Genetics Conference, April 22-26, 2020. #TAGC20</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Maiko Kitaoka et al.</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/3d-gastruloids/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">3D Gastruloids</h2>
        <p>A curated list of preprints related to Gastruloids (in vitro models of early development obtained by 3D aggregation of embryonic cells). Preprint missing? Don't hesitate to let us know.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Paul Gerald L. Sanchez and Stefano Vianello</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/fungal-biology/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">ECFG15 &#8211;  Fungal biology</h2>
        <p>Preprints presented at 15th European Conference on Fungal Genetics 17-20 February 2020 Rome</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Hiral Shah</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/ascb-embo-annual-meeting-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">ASCB EMBO Annual Meeting 2019</h2>
        <p>A collection of preprints presented at the 2019 ASCB EMBO Meeting in Washington, DC (December 7-11)</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Madhuja Samaddar et al.</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/embl-seeing-is-believing-imaging-the-molecular-processes-of-life/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EMBL Seeing is Believing &#8211; Imaging the Molecular Processes of Life</h2>
        <p>Preprints discussed at the 2019 edition of Seeing is Believing, at EMBL Heidelberg from the 9th-12th October 2019</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/autophagy/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Autophagy</h2>
        <p>Preprints on autophagy and lysosomal degradation and its role in neurodegeneration and disease. Includes molecular mechanisms, upstream signalling and regulation as well as studies on pharmaceutical interventions to upregulate the process.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Sandra Malmgren Hill</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/lung-disease-and-regeneration/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Lung Disease and Regeneration</h2>
        <p>This preprint list compiles highlights from the field of lung biology.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Rob Hynds</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/cellular-metabolism/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Cellular metabolism</h2>
        <p>A curated list of preprints related to cellular metabolism at Biorxiv by Pablo Ranea Robles from the Prelights community. Special interest on lipid metabolism, peroxisomes and mitochondria.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Pablo Ranea Robles</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/bscb-bsdb-annual-meeting-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">BSCB/BSDB Annual Meeting 2019</h2>
        <p>Preprints presented at the BSCB/BSDB Annual Meeting 2019</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/mitolist/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">MitoList</h2>
        <p>This list of preprints is focused on work expanding our knowledge on mitochondria in any organism, tissue or cell type, from the normal biology to the pathology.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Sandra Franco Iborra</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/10744-2/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Biophysical Society Annual Meeting 2019</h2>
        <p>Few of the preprints that were discussed in the recent BPS annual meeting at Baltimore, USA</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Joseph Jose Thottacherry</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/ascb-embo-annual-meeting-2018/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">ASCB/EMBO Annual Meeting 2018</h2>
        <p>This list relates to preprints that were discussed at the recent ASCB conference.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab, Amanda Haage</td>
                </tr>
            </table>
        </div>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
                                <div class="container">
                                <h2 class="title">Also in the <span
                            class="search-keyword">developmental biology</span>
                        category:</h2>
                    
            <div class="row">
            <div class="col-xs-12">
                                        <div class="block-grid-xs-1 block-grid-sm-2 block-grid-lg-3">
                            
                            <a href="https://prelights.biologists.com/prelists/embl-synthetic-morphogenesis-from-gene-circuits-to-tissue-architecture-2021/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EMBL Synthetic Morphogenesis: From Gene Circuits to Tissue Architecture (2021)</h2>
        <p>A list of preprints mentioned at the #EESmorphoG virtual meeting in 2021.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/embl-conference-from-functional-genomics-to-systems-biology/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EMBL Conference: From functional genomics to systems biology</h2>
        <p>Preprints presented at the virtual EMBL conference "from functional genomics and systems biology", 16-19 November 2020</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Jesus Victorino</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/single-cell-biology-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Single Cell Biology 2020</h2>
        <p>A list of preprints mentioned at the Wellcome Genome Campus Single Cell Biology 2020 meeting. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/society-for-developmental-biology-79th-annual-meeting/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Society for Developmental Biology 79th Annual Meeting</h2>
        <p>Preprints at SDB 2020</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Irepan Salvador-Martinez, Martin Estermann</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/fens-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">FENS 2020</h2>
        <p>A collection of preprints presented during the virtual meeting of the Federation of European Neuroscience Societies (FENS) in 2020</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Ana Dorrego-Rivas</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/planar-cell-polarity-pcp/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Planar Cell Polarity &#8211; PCP</h2>
        <p>This preList contains preprints about the latest findings on Planar Cell Polarity (PCP) in various model organisms at the molecular, cellular and tissue levels. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Ana Dorrego-Rivas</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/cell-polarity/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Cell Polarity</h2>
        <p>Recent research from the field of cell polarity is summarized in this list of preprints.  It comprises of studies focusing on various forms of cell polarity ranging from epithelial polarity, planar cell polarity to front-to-rear polarity.   </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Yamini Ravichandran</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/tagc-2020/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">TAGC 2020</h2>
        <p>Preprints recently presented at the virtual Allied Genetics Conference, April 22-26, 2020. #TAGC20</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Maiko Kitaoka et al.</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/3d-gastruloids/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">3D Gastruloids</h2>
        <p>A curated list of preprints related to Gastruloids (in vitro models of early development obtained by 3D aggregation of embryonic cells). Preprint missing? Don't hesitate to let us know.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Paul Gerald L. Sanchez and Stefano Vianello</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/ascb-embo-annual-meeting-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">ASCB EMBO Annual Meeting 2019</h2>
        <p>A collection of preprints presented at the 2019 ASCB EMBO Meeting in Washington, DC (December 7-11)</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Madhuja Samaddar et al.</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/edbc-alicante-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EDBC Alicante 2019</h2>
        <p>Preprints presented at the European Developmental Biology Congress (EDBC) in Alicante, October 23-26 2019. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Sergio Menchero et al.</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/embl-seeing-is-believing-imaging-the-molecular-processes-of-life/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">EMBL Seeing is Believing &#8211; Imaging the Molecular Processes of Life</h2>
        <p>Preprints discussed at the 2019 edition of Seeing is Believing, at EMBL Heidelberg from the 9th-12th October 2019</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/sdb-78th-annual-meeting-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">SDB 78th Annual Meeting 2019</h2>
        <p>A curation of the preprints presented at the SDB meeting in Boston, July 26-30 2019. The preList will be updated throughout the duration of the meeting.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/lung-disease-and-regeneration/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Lung Disease and Regeneration</h2>
        <p>This preprint list compiles highlights from the field of lung biology.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Rob Hynds</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/young-embryologist-network-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Young Embryologist Network Conference 2019</h2>
        <p>Preprints presented at the Young Embryologist Network 2019 conference, 13 May, The Francis Crick Institute, London</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alex Eve</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/pattern-formation-during-development/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Pattern formation during development</h2>
        <p>The aim of this preList is to integrate results about the mechanisms that govern patterning during development, from genes implicated in the processes to theoritical models of pattern formation in nature. </p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Alexa Sadier</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/bscb-bsdb-annual-meeting-2019/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">BSCB/BSDB Annual Meeting 2019</h2>
        <p>Preprints presented at the BSCB/BSDB Annual Meeting 2019</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Dey Lab</td>
                </tr>
            </table>
        </div>
            </div>
</a><a href="https://prelights.biologists.com/prelists/zebrafish-immunology/" class="block-grid-item">
    <div class="grid-item--background prelist-grid-item--background">
        		<h2 class="grid-item__title">Zebrafish immunology</h2>
        <p>A compilation of cutting-edge research that uses the zebrafish as a model system to elucidate novel immunological mechanisms in health and disease.</p>
		<p class="contributor__author">&nbsp;</p>
        <br/><br/>
        
        <div class="selectors">
            <table>
                <tr>
                    <td><span class="selectedby">List by </span></td>
                    <td>Shikha Nayar</td>
                </tr>
            </table>
        </div>
            </div>
</a>                        </div>

                                            </div>
                </div>
            </div>
                <script type="application/javascript">
        jQuery(document).ready(function() {
            jQuery("#related-content-prelists").show();
        });
    </script>
        </div>
</div>


<script type="application/javascript">
    // Apply class to all report comments buttons and move the button to new location
    jQuery(".cld-like-dislike-wrap").addClass("button button--recessive--white button--small");
    jQuery(".cld-like-dislike-wrap").each(function(){
        insert_next_to = jQuery(this).parent().find(".safe-comments-report-link").first();
        console.log(insert_next_to);
        jQuery(this).detach();
        insert_next_to.prepend(jQuery(this));
    });
</script>

<footer class="footer">
    <div class="row social-media">
    <div class="col-xs-12">
        <div class="social-media__item"><a href="https://www.facebook.com/preLights/" target="_blank"><span class="fab fa-facebook-square"></span></a></div>
        <div class="social-media__item"><a href="https://twitter.com/preLights" target="_blank"><span class="fab fa-twitter"></span></a></div>
        <div class="social-media__item"><a href="https://www.youtube.com/user/CompanyofBiologists" target="_blank"><span class="fab fa-youtube"></span></a></div>
    </div>
</div>

        <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <div class="well promotion">
                    <p>preLights is a community initiative supported by The Company of Biologists</p>
<p>The Company of Biologists is a not-for-profit publishing organisation dedicated to supporting and inspiring the biological community. The Company publishes five specialist peer-reviewed journals: <a href="http://dev.biologists.org/" target="_blank" rel="noopener">Development</a>, <a href="http://jcs.biologists.org/" target="_blank" rel="noopener">Journal of Cell Science</a>, <a href="http://jeb.biologists.org/" target="_blank" rel="noopener">Journal of Experimental Biology</a>, <a href="http://dmm.biologists.org/" target="_blank" rel="noopener">Disease Models &amp; Mechanisms</a> and <a href="http://bio.biologists.org/" target="_blank" rel="noopener">Biology Open</a>. It offers further support to the biological community by facilitating scientific meetings, providing travel grants for researchers and supporting research societies.</p>
<p>In <a href="https://youtu.be/Bc36VY3Uk1k" target="_blank" rel="noopener">this video</a> our directors tell you more about our activities and why they choose to dedicate their time to the Company.</p>
<p><a href="http://www.biologists.com" target="_blank" rel="noopener">www.biologists.com</a></p>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <div class="footer__links">
                    <div id="footer-nav" class="footer"><ul id="menu-footer-navigation" class="footer-menu"><li id="menu-item-420" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-420"><a href="http://www.biologists.com/privacy-policy/">Privacy Policy</a></li>
<li id="menu-item-421" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-421"><a href="http://www.biologists.com/terms-conditions/">Terms &#038; Conditions</a></li>
<li id="menu-item-422" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-422"><a href="http://www.biologists.com/">The Company of Biologists</a></li>
</ul></div>                </div>

                <div class="footer__legals">
                    <p>&copy; 2021 The Company of Biologists Ltd | Registered Charity 277992.</p>
                    <p>Registered in England and Wales | Company Limited by Guarantee No 514735.</p>
                    <p>Registered office: Bidder Building, Station Road, Histon, Cambridge CB24 9LF, UK.</p>
                </div>
            </div>
        </div>
    </div>
</footer>

<div id="search-overlay" class="filters filters-overlay overlay">
    <div class="overlay__inner">
        <div class="tabs container container-sm">

            <div class="tab-buttons">
                <button class="button button__tab button__tab--active" data-tab="keyword">Search by keyword</button>
            </div>

            <div class="tab-content">

                <div class="tab__block" data-content="keyword">
                    <form action="/?s" accept-charset="UTF-8" autocomplete="off" role="search" class="search js-validate">

    <div class="form-field keyword collapse-bottom">
        <label class="sr-only" for="q">Search</label>
        <input name="s" id="q" type="text" class="form-field--text" placeholder="Enter a keyword" required data-msg-required="" value="">
    </div>

    <div class="stripe stripe--dark-grey advanced-search">
        <div class="mb--16 text-center">
            <span class="text-label"><span>and/or</span></span>
        </div>

        <div class="block-grid-xs-1 block-grid-sm-2 date-variables">
            <div class="block-grid-item">
                <div class="form-field">
                    <label for="datefrom">Date from</label>
                    <input type="text" name="datefrom" class="datefrom form-field--text" value="">
                </div>
            </div>
            <div class="block-grid-item">
                <div class="form-field">
                    <label for="dateto">Date to</label>
                    <input type="text" name="dateto" class="dateto form-field--text" value="">
                </div>
            </div>
        </div>

        <div class="text-center mt--16">
            <button class="button button--blue" type="submit"><span class="fas fa-search"></span>&nbsp;Search</button>
        </div>
    </div>

</form>
                </div>
                <script type="text/javascript">
                    jQuery(document).ready(function(){
                        $('#search-overlay .datefrom').datepicker({dateFormat: 'dd/mm/yy'});
                        $('#search-overlay .dateto').datepicker({dateFormat: 'dd/mm/yy'});
                    });
                </script>
            </div>

        </div>
    </div>

    <div class="overlay__button overlay__button--right" data-js="filter-toggle-button">
        <span class="fas fa-times" aria-hidden="true"></span> <span>Close</span>
    </div>
</div>

    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="/dist/global.min.js"></script>
    <script>
        // Post ratings hover over
        jQuery(".post-ratings").hover(
        function() {
            src = jQuery(".post-ratings img").attr("src");

            if (src.indexOf("_off") > -1){
                src = src.replace("_off", "_over");
            } else {
                src = src.replace("_on", "_over");
            }
            console.log("on");
            jQuery(".post-ratings img").attr("src", src );
        }, function() {
                console.log("off");
            src = jQuery(".post-ratings img").attr("src").replace("_over", "_off");
            jQuery(".post-ratings img").attr("src", src );
        }
        );
    </script>
<script type='text/javascript'>
/* <![CDATA[ */
var pwsL10n = {"unknown":"Password strength unknown","short":"Very weak","bad":"Weak","good":"Medium","strong":"Strong","mismatch":"Mismatch"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-admin/js/password-strength-meter.min.js?ver=4.9.18'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var wpcf7 = {"apiSettings":{"root":"https:\/\/prelights.biologists.com\/wp-json\/contact-form-7\/v1","namespace":"contact-form-7\/v1"},"recaptcha":{"messages":{"empty":"Please verify that you are not a robot."}},"cached":"1"};
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/contact-form-7/includes/js/scripts.js?ver=5.0.5'></script>
<script type='text/javascript' src='https://s0.wp.com/wp-content/js/devicepx-jetpack.js?ver=202122'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var ratingsL10n = {"plugin_url":"https:\/\/prelights.biologists.com\/wp-content\/plugins\/wp-postratings","ajax_url":"https:\/\/prelights.biologists.com\/wp-admin\/admin-ajax.php","text_wait":"Please rate only 1 item at a time.","image":"cob_thumbs","image_ext":"png","max":"1","show_loading":"0","show_fading":"0","custom":"1"};
var ratings_1_mouseover_image=new Image();ratings_1_mouseover_image.src="https://prelights.biologists.com/wp-content/plugins/wp-postratings/images/cob_thumbs/rating_1_over.png";;
/* ]]> */
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/wp-postratings/js/postratings-js.js?ver=1.89'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/ui/core.min.js?ver=1.11.4'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/ui/datepicker.min.js?ver=1.11.4'></script>
<script type='text/javascript'>
jQuery(document).ready(function(jQuery){jQuery.datepicker.setDefaults({"closeText":"Close","currentText":"Today","monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"nextText":"Next","prevText":"Previous","dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["S","M","T","W","T","F","S"],"dateFormat":"dS MM yy","firstDay":1,"isRTL":false});});
</script>
<script type='text/javascript' src='//cc.cdn.civiccomputing.com/8.0/cookieControl-8.0.min.js?ver=4.9.18'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/wp-embed.min.js?ver=4.9.18'></script>
<script async="async" type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/akismet/_inc/form.js?ver=4.1.6'></script>
<script type="text/javascript">
/* <![CDATA[ */
jQuery(document).ready( function($) {
$("ul.nav-menu").not(":has(li)").hide().closest('div').hide();
});
/* ]]> */
</script><script type='text/javascript' src='https://stats.wp.com/e-202122.js' async='async' defer='defer'></script>
<script type='text/javascript'>
	_stq = window._stq || [];
	_stq.push([ 'view', {v:'ext',j:'1:6.7.2',blog:'143028432',post:'29382',tz:'1',srv:'prelights.biologists.com'} ]);
	_stq.push([ 'clickTrackerInit', '143028432', '29382' ]);
</script>

<script type="text/javascript">
  var config = {
    apiKey: '7c424eb72838c82fe4573185f17de8d93f75d9e0',
    product: 'PRO_MULTISITE',
    logConsent : 'NO',    
    
    initialState: "OPEN",
    position: "RIGHT",
    theme: "DARK",
    layout: "POPUP",
    consentCookieExpiry: 90,
        
    text : {
      title: 'This site uses cookies',
      intro:  'Some of these cookies are essential, while others help us to improve your experience by providing insights into how the site is being used.',
      necessaryTitle : 'Necessary Cookies',
      necessaryDescription : 'Necessary cookies enable core functionality. The website cannot function properly without these cookies, and can only be disabled by changing your browser preferences.',
      thirdPartyTitle : 'Warning: Some cookies require your attention',
      thirdPartyDescription : 'Consent for the following cookies could not be automatically revoked. Please follow the link(s) below to opt out manually.',
      on : 'On',
      off : 'Off',
      accept : 'Accept',
      settings : 'Cookie Preferences',
      acceptRecommended : 'Accept Recommended Settings',
      notifyTitle : 'Your choice regarding cookies on this site',
      notifyDescription : 'We use cookies to optimise site functionality and give you the best possible experience.',
    },
    
    branding : {
      fontColor: "#fff",
      fontFamily: "Open Sans, Helvetica, Arial, sans-serif",
      fontSizeTitle: "1.2em",
      fontSizeHeaders: "1em",
      fontSize: "1em",
      backgroundColor: '#009538',
      toggleText: '#fff',
      toggleColor: '#323031',
      toggleBackground: '#4C4B4B',
      alertText: '#fff',
      alertBackground: '#3B3F40',
              buttonIcon: null,
        
      buttonIconWidth: "64px",
      buttonIconHeight: "64px",
      removeIcon: false,
      removeAbout: true    },      
          
          
      
      
    
            
          
        
      necessaryCookies: [ 'wordpress_*','wordpress_logged_in_*' ],
                
        optionalCookies: [
                          {
            name: 'analytics',
            label: 'Analytical Cookies',
            description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
            cookies: [ '_ga', '_gid', '_gat', '__utma' ],
            onAccept : function(){
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-57233518-2', 'auto');
    ga('send', 'pageview');            },
            onRevoke : function(){
              window['ga-disable-UA-57233518-2'] = true;            },
             
            initialConsentState : 'on',
          },
                    ],
        
    statement:  {
      description: '',
      name: 'Privacy Policy',
      url: 'http://www.biologists.com/privacy-policy/',
      updated: ''
    },
    
      
  };

  CookieControl.load( config );
</script>
<script>
   jQuery( document ).ready( function( $ ) {			
      $('.header__menu__link').each(function() {
         if ($(this).text() == "Search") {
            $(this).click(function( event ) {
               event.preventDefault();
               toggleOverlay($('.filters-overlay'));
            });				
         }
      });		
   });			
</script>
<script>
    if (!localStorage.getItem('ccClosed')) {
        if (document.getElementById("cookieextra") != null) {
            document.getElementById("cookieextra").style.display = "block";
        }
    }
</script>

<script type="application/javascript">
    jQuery(document).ready(function() {
        var related_content_shown = false;
        var element_position = $('#related-content-trigger-point').offset().top;

        jQuery(window).on('scroll', function() {
            var y_scroll_pos = window.pageYOffset;
            var scroll_pos_test = element_position;

            if(y_scroll_pos > scroll_pos_test && !related_content_shown) {
                jQuery(".related-content").toggle( "slide" );
                related_content_shown = true;
            }
        });
    });
</script>

<script type="application/javascript">
    // Google Analytics Form Tracking
    document.addEventListener( 'wpcf7mailsent', function( event ) {
        console.log("Logging event: Form, submit, " + window.location.pathname);
        ga('send', 'event', 'Form', 'submit', window.location.pathname);
    }, false );

    // Additional Google Analytics Tracking By Events
    // https://www.blastam.com/blog/how-to-track-downloads-in-google-analytics-v2
    // https://gist.githubusercontent.com/nate-louie/612a99dda5626a65a8a5e782e92e0560/raw/70ce9e940db965fc1a6e90d5c81e081720b6e0ac/ga-download-outbound-track.js
    if (typeof jQuery != 'undefined') {
        jQuery(document).ready(function($) {
            var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
            var baseHref = '';
            if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');

            jQuery('a').on('click', function(event) {
                var el = jQuery(this);
                var track = true;
                var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";
                var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
                if (!href.match(/^javascript:/i)) {
                    var elEv = []; elEv.value=0, elEv.non_i=false;
                    if (href.match(/^mailto\:/i)) {
                        elEv.category = "email";
                        elEv.action = "click";
                        elEv.label = href.replace(/^mailto\:/i, '');
                        elEv.loc = href;
                    }
                    else if (href.match(filetypes)) {
                        var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
                        elEv.category = "download";
                        elEv.action = "click-" + extension[0];
                        elEv.label = href.replace(/ /g,"-");
                        elEv.loc = baseHref + href;
                    }
                    else if (href.match(/^https?\:/i) && !isThisDomain) {
                        elEv.category = "external";
                        elEv.action = "click";
                        elEv.label = href.replace(/^https?\:\/\//i, '');
                        elEv.non_i = true;
                        elEv.loc = href;
                    }
                    else if (href.match(/^tel\:/i)) {
                        elEv.category = "telephone";
                        elEv.action = "click";
                        elEv.label = href.replace(/^tel\:/i, '');
                        elEv.loc = href;
                    }
                    else track = false;

                    if (track) {
                        if (elEv.non_i == true){
                            ga('send', 'event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), {
                                nonInteraction: true
                            });
                        } else {
                            ga('send', 'event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase());
                        }
                        if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
                            setTimeout(function() { location.href = elEv.loc; }, 400);
                            return false;
                        }
                    }
                }
            });
        });
    }

    function trackAction(category, action) {
        var el = jQuery(this);
        label = window.location.pathname;

        ga('send', 'event', category.toLowerCase(), action.toLowerCase(), label.toLowerCase(), {
            nonInteraction: true
        });
    }

    // Track share daddy social shares and comment commits
    jQuery(document).ready(function($) {
        var el = jQuery(this);
        var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";

        //twitter
        jQuery('a.share-twitter').click(function(){
            trackAction("share", "twitter");
        });

        //facebook
        jQuery('a.share-facebook').click(function(){
            trackAction("share", "facebook");
        });

        //email
        jQuery('a.share-email').click(function(){
            trackAction("share", "email");
        });

        // Track comment submit
        jQuery('#respond button#submit').click(function(){
            trackAction("comment", "comment");
        });
    });
</script>

</div> <!-- /main-wrapper -->
<!-- Timings
Total secs: 0.41426992416382 
Start to Mid_1 secs: 0.053802013397217 
Mid_1 to Mid 2 secs: 0.045349836349487 
Mid_2 to End secs: 0.31511807441711 
-->
</body>
</html>

<!-- Dynamic page generated in 0.838 seconds. -->
<!-- Cached page generated by WP-Super-Cache on 2021-06-04 09:39:56 -->

<!-- super cache -->
    `;
export const fetchPrelightsHighlight: EvaluationFetcher = (key: string) => TE.right({
  url: new URL(key),
  fullText: toHtmlFragment('All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels'),
});
