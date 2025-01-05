declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

export const initializeAnalytics = () => {
  if (!TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found in environment variables');
    return;
  }

  // Create script elements
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${TRACKING_ID}');
  `;

  // Add scripts to document head
  document.head.appendChild(script1);
  document.head.appendChild(script2);
};

export const trackEvent = (eventName: string, params?: { [key: string]: any }) => {
  if (!TRACKING_ID) return;
  
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};
