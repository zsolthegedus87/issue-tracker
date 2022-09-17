import Vue from "vue";
import VueRouter from "vue-router";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

Vue.use(VueRouter);

const routes = [
	{
		path: "/add-issue",
		name: "Add issue",
		component: () =>
			import(
				/* webpackChunkname: "about" */ "../views/AddIssueView.vue"
			),
	},
	{
		path: "/list-issues",
		name: "List Issues",
		component: () =>
			import(
				/* webpackChunkname: "about" */ "../views/ListIssuesView.vue"
			),
	},
	{
		path: "*",
		redirect: "/add-issue",
	},
];

const index = new VueRouter({
	mode: "history",
	routes,
});

index.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const isAuthenticated = firebase.auth().currentUser;

	if (requiresAuth && !isAuthenticated) {
		next("/login");
	} else {
		next();
	}
});

export default index;
