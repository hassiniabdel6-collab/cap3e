// ── GESTION CONSENTEMENT COOKIES — Cap 3e ──────────────────────
// Version 2.0 — 29 juillet 2026 — Consent Mode "basique"
//
// Principe : GA4 n'est JAMAIS chargé tant qu'un consentement positif n'a
// pas été enregistré. Avant tout choix, et en cas de refus, aucun script
// Google n'est injecté dans le DOM et aucune requête réseau vers Google
// n'est émise. C'est la différence avec la v1.0 : il n'y a plus de balise
// <script src="googletagmanager.com/...">  statique dans le <head> des
// pages ; ce fichier est desormais l'unique point d'entrée qui décide,
// et le seul endroit du projet où l'identifiant G-NCCXNNL215 apparaît
// dans une balise <script>.

var CAP3E_CONSENT_KEY = 'cap3e_cookie_consent';
var CAP3E_GA_ID = 'G-NCCXNNL215';
var CAP3E_GA_SCRIPT_ID = 'cap3e-ga4-script';

// État par défaut : désactivé. Posé en tout premier, avant toute autre
// logique, pour qu'aucun appel gtag() ne puisse jamais transmettre de
// donnée tant que cap3eLoadGA4() n'a pas explicitement levé ce drapeau.
window['ga-disable-' + CAP3E_GA_ID] = true;

function cap3eInitDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
}

// Charge GA4 dynamiquement. N'est appelée QUE depuis cap3eAcceptCookies()
// ou depuis l'initialisation si un consentement "accepted" est déjà
// mémorisé. N'injecte jamais la balise deux fois sur une même page.
function cap3eLoadGA4() {
  cap3eInitDataLayer();
  window['ga-disable-' + CAP3E_GA_ID] = false;

  if (document.getElementById(CAP3E_GA_SCRIPT_ID)) {
    // Script déjà présent sur cette page (ex. appel redondant) : ne pas
    // recréer de balise, seulement confirmer le consentement.
    gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }

  var script = document.createElement('script');
  script.id = CAP3E_GA_SCRIPT_ID;
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CAP3E_GA_ID;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('config', CAP3E_GA_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
}

function cap3eDisableGA4() {
  window['ga-disable-' + CAP3E_GA_ID] = true;
}

function cap3eShowBanner() {
  if (document.getElementById('cap3e-cookie-banner')) return;
  var banner = document.createElement('div');
  banner.id = 'cap3e-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Gestion des cookies');
  banner.innerHTML = [
    '<style>',
    '#cap3e-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    'background:#0A1F44;color:#fff;padding:1rem 1.5rem;',
    'display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.5rem;',
    'font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;',
    'border-top:3px solid #B8972A;box-shadow:0 -2px 12px rgba(0,0,0,0.2)}',
    '#cap3e-cookie-banner p{margin:0;flex:1;min-width:200px;color:rgba(255,255,255,0.85)}',
    '#cap3e-cookie-banner a{color:#C9A227;text-underline-offset:2px}',
    '.cap3e-btn{padding:8px 18px;border-radius:6px;border:none;cursor:pointer;',
    'font-size:13px;font-weight:600;font-family:inherit;white-space:nowrap}',
    '.cap3e-btn-accept{background:#B8972A;color:#fff}',
    '.cap3e-btn-refuse{background:transparent;color:rgba(255,255,255,0.7);',
    'border:1px solid rgba(255,255,255,0.3)}',
    '.cap3e-btn-refuse:hover{background:rgba(255,255,255,0.08)}',
    '</style>',
    '<p>Cap 3e utilise Google Analytics pour mesurer la fr\u00e9quentation du site \u00e0 des fins statistiques.',
    ' <a href="cookies.html">En savoir plus</a></p>',
    '<div style="display:flex;gap:0.5rem;flex-shrink:0">',
    '<button class="cap3e-btn cap3e-btn-refuse" onclick="cap3eRefuseCookies()">Refuser</button>',
    '<button class="cap3e-btn cap3e-btn-accept" onclick="cap3eAcceptCookies()">Accepter</button>',
    '</div>'
  ].join('');
  document.body.appendChild(banner);
}

function cap3eAcceptCookies() {
  localStorage.setItem(CAP3E_CONSENT_KEY, 'accepted');
  var banner = document.getElementById('cap3e-cookie-banner');
  if (banner) banner.remove();
  cap3eLoadGA4();
}

function cap3eRefuseCookies() {
  localStorage.setItem(CAP3E_CONSENT_KEY, 'refused');
  var banner = document.getElementById('cap3e-cookie-banner');
  if (banner) banner.remove();
  cap3eDisableGA4(); // pas d'injection de script — GA4 ne charge jamais
}

// Utilisée par le bouton "Modifier mes préférences cookies" de cookies.html
// (inchangé — le nom de la fonction est conservé pour compatibilité).
function cap3eResetConsent() {
  localStorage.removeItem(CAP3E_CONSENT_KEY);
  location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
  var consent = localStorage.getItem(CAP3E_CONSENT_KEY);
  if (consent === 'accepted') {
    // Consentement déjà mémorisé : GA4 peut se charger automatiquement,
    // sans réafficher la bannière (cf. consigne "chargé automatiquement
    // au prochain affichage").
    cap3eLoadGA4();
  } else if (consent === 'refused') {
    cap3eDisableGA4();
  } else {
    // Aucun choix encore enregistré : ne rien charger, afficher la bannière.
    cap3eDisableGA4();
    cap3eShowBanner();
  }
});
