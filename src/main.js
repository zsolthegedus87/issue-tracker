import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

let config = {
	apiKey: "AIzaSyDedfY6UQyKISmkVcMZyYzFGnjy9rRYGhw",
	authDomain: "hzs-issue-tracker.firebaseapp.com",
	projectId: "hzs-issue-tracker",
	storageBucket: "hzs-issue-tracker.appspot.com",
	messagingSenderId: "883817109969",
	appId: "1:883817109969:web:27b111667d1a0fc4aba8f0",
};

firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
export const bus = new Vue();

new Vue({
	render: (h) => h(App),
	router,
}).$mount("#app");
