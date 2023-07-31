importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
 apiKey: "AIzaSyBTbnaYDbMR_8ZKCP15C4j8qyXWJL3W1Kk",
 authDomain: "careerscriptchat.firebaseapp.com",
 databaseURL: "https://careerscriptchat-default-rtdb.firebaseio.com",
 projectId: "careerscriptchat",
 storageBucket: "careerscriptchat.appspot.com",
 messagingSenderId: "630796181433",
 appId: "1:630796181433:web:4730750032d1f42d63a068",
 //measurementId: "config data from general tab"
});
// firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();