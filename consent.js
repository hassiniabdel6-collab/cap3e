// ── GESTION CONSENTEMENT COOKIES — Cap 3e ──────────────────────
// Version 1.0 — Juillet 2026 — Conforme recommandations CNIL

var CAP3E_CONSENT_KEY = 'cap3e_cookie_consent';

function cap3eLoadGA4() {
  if (typeof gtag !== 'function') return;
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
  gtag('config', 'G-NCCXNNL215', {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
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
  document.getElementById('cap3e-cookie-banner').remove();
  cap3eLoadGA4();
}

function cap3eRefuseCookies() {
  localStorage.setItem(CAP3E_CONSENT_KEY, 'refused');
  document.getElementById('cap3e-cookie-banner').remove();
  // Désactiver GA4
  window['ga-disable-G-NCCXNNL215'] = true;
}

function cap3eResetConsent() {
  localStorage.removeItem(CAP3E_CONSENT_KEY);
  location.reload();
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
  var consent = localStorage.getItem(CAP3E_CONSENT_KEY);
  if (consent === 'accepted') {
    cap3eLoadGA4();
  } else if (consent === 'refused') {
    window['ga-disable-G-NCCXNNL215'] = true;
  } else {
    // Pas encore de choix — afficher la bannière
    cap3eShowBanner();
  }
});
