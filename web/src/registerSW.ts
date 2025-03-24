export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );

          // Check for updates to the Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker is installed but waiting to activate
                  console.log('New service worker available, updating...');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // When a new service worker takes over, reload the page for fresh content
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker controller, reloading page...');
        window.location.reload();
      });
    });
  }

  // Add an offline/online status indicator to the app
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  function updateOnlineStatus() {
    if (navigator.onLine) {
      console.log('App is online');
    } else {
      console.log('App is offline');
    }
  }

  updateOnlineStatus();
}
