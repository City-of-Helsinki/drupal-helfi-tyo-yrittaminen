((drupalSettings) => {
  const NODE_BOOK_ADVISORY = 'node/115';
  const NODE_EVENTS = 'node/143';
  const NODES_CTA = ['node/111', 'node/147'];

  const BOOKING_URL = 'https://customervoice.microsoft.com/';
  const NEWSLETTER_URL = 'https://assets-eur.mkt.dynamics.com/';
  // Event list root: hdbt 6.18 uses a class (several lists per page), older
  // versions an id.
  const EVENT_CARD_LINK = '.helfi-events-search .card__link, #helfi-events-search .card__link';
  const DOWNLOAD_EXTENSIONS = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|zip)$/i;

  const currentPath = drupalSettings?.path?.currentPath;

  // HDBT instantiates Matomo
  const isMatomoReady = () => {
    const paq = window._paq;

    if (Array.isArray(paq)) {
      return paq.some((command) => Array.isArray(command) && command[0] === 'trackPageView');
    }

    return Boolean(paq && window.Matomo?.getAsyncTrackers?.().length);
  };

  const trackEvent = (category, action, name) => {
    if (!isMatomoReady()) {
      return;
    }
    window._paq.push(['trackEvent', category, action, name]);
  };

  // Visible text of the element without screen reader only helper texts
  // such as "(Link leads to external service)".
  const getText = (element) => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.visually-hidden, .link__type').forEach((hidden) => {
      hidden.remove();
    });
    return clone.textContent
      .replace(/\p{Cf}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const isDownloadLink = (link) => {
    try {
      return DOWNLOAD_EXTENSIONS.test(new URL(link.href).pathname);
    } catch {
      return false;
    }
  };

  const handlers = {
    [NODE_BOOK_ADVISORY]: (link) => {
      if (link.href.startsWith(BOOKING_URL)) {
        trackEvent('Meeting_reservation', 'Click', 'Book_business_advisory');
      }
    },
    [NODE_EVENTS]: (link) => {
      const title = link.matches(EVENT_CARD_LINK) && link.closest('.card')?.querySelector('.card__title');
      if (title) {
        trackEvent('Events', 'Click', `Event_${getText(title)}`);
      }
    },
  };

  NODES_CTA.forEach((node) => {
    handlers[node] = (link) => {
      if (link.matches('[data-hds-component="button"]') || isDownloadLink(link)) {
        trackEvent('Events', 'Click', `CTA_${getText(link)}`);
      }
    };
  });

  const handler = handlers[currentPath];

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element && event.target.closest('a[href]');
    if (!link) {
      return;
    }

    // The newsletter button is shown on many pages, so it is tracked
    // everywhere and takes precedence over the page specific events.
    if (link.href.startsWith(NEWSLETTER_URL)) {
      trackEvent('Events', 'Click', 'Subscribe_newsletter');
      return;
    }

    if (handler && link.closest('main')) {
      handler(link);
    }
  });
})(drupalSettings);
