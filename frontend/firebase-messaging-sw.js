// // firebase-messaging-sw.js - Place in your frontend folder

// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


// const firebaseConfig = {
//   apiKey: "AIzaSyDx6l4ouFfZOy2tIobzz5gia7vp6sPqSO4",
//   authDomain: "disasterresponsesystem-d5545.firebaseapp.com",
//   projectId: "disasterresponsesystem-d5545",
//   storageBucket: "disasterresponsesystem-d5545.firebasestorage.app",
//   messagingSenderId: "205634786457",
//   appId: "1:205634786457:web:fb5036d471e21820189408",
//   measurementId: "G-DM8RM10RXT"
// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message', payload);
  
//   const notificationTitle = payload.notification?.title || '🚨 New Disaster Alert';
//   const notificationOptions = {
//     body: payload.notification?.body || 'Check the allocation page for details',
//     icon: '/icon.png',
//     data: {
//       url: '/allocation.html',
//       disasterId: payload.data?.disasterId
//     },
//     badge: '/badge.png',
//     vibrate: [200, 100, 200],
//     requireInteraction: true
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// // Handle notification click
// self.addEventListener('notificationclick', (event) => {
//   console.log('Notification clicked:', event);
//   event.notification.close();
  
//   const urlToOpen = event.notification.data?.url || '/allocation.html';
  
//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true })
//       .then((clientList) => {
//         for (const client of clientList) {
//           if (client.url.includes(urlToOpen) && 'focus' in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow(urlToOpen);
//         }
//       })
//   );
// });
// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDx6l4ouFfZOy2tIobzz5gia7vp6sPqSO4",
    authDomain: "disasterresponsesystem-d5545.firebaseapp.com",
    projectId: "disasterresponsesystem-d5545",
    storageBucket: "disasterresponsesystem-d5545.firebasestorage.app",
    messagingSenderId: "205634786457",
    appId: "1:205634786457:web:fb5036d471e21820189408",
    measurementId: "G-DM8RM10RXT"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background message:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 New Disaster Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'Check the allocation page',
        icon: '/favicon.ico',
        data: { url: '/allocation.html' }
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/allocation.html'));
});