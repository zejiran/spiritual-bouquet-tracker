export function unregisterServiceWorker() {
  // Unregister any existing service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('Service Worker unregistered');
      }
    });
  }

  console.log('Service Worker registration is disabled');
}
