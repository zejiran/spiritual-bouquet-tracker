export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );
        },
        (error) => {
          console.error('Service Worker registration failed:', error);
        }
      );
    });
  }
}
