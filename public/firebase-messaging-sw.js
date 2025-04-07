/* eslint-disable no-undef */
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase inside the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCNqZC_TopvpOH4mK3PZ90nDeCgZ3XLL8s",
  authDomain: "transactionbook-4bb66.firebaseapp.com",
  projectId: "transactionbook-4bb66",
  storageBucket: "transactionbook-4bb66.appspot.com",
  messagingSenderId: "794670299635",
  appId: "1:794670299635:web:bb673f087e432e0e9fba86",
  measurementId: "G-G1LQ3C7K21"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
