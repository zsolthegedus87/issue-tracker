<template lang="pug">
	#app
		nav.navbar.is-primary(role='navigation' aria-label='main navigation')
			.navbar-brand
				a.navbar-item(href='#')
					img(src='https://bulma.io/images/bulma-logo.png' width='112' height='28')
				a.navbar-burger(role='button' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample', @click="menuToggle = !menuToggle" :class="{ 'is-active': menuToggle }")
					span(aria-hidden='true')
					span(aria-hidden='true')
					span(aria-hidden='true')
			#navbarBasicExample.navbar-menu(:class="{ 'is-active': menuToggle }")
				.navbar-start
					router-link.navbar-item(to="/add-issue", active-class="is-active") Add issue
					router-link.navbar-item(to="/list-issues", active-class="is-active") List Issues
		main(role="main")
			router-view


</template>
<script>
export default {
	name: "App",
	data() {
		return {
			menuToggle: false
		};
	},
};
</script>
<style lang="scss">
@import "common/css/main.scss";
[v-cloak] {
	display: none;
}
</style>
