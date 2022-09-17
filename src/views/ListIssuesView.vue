<template lang="pug">
	section
		.column.is-half.is-offset-one-quarter
			h1.mb-3.is-size-3.is-size-3-mobile.has-text-weight-bold.has-text-centered List Issues
			ListIssues


</template>
<script>
// @ is an alias to /src
import ListIssues from "@/components/ListIssues";

export default {
	name: "ListIssuesView",
	components: {
		ListIssues,
	},
};
</script>


<style lang="scss" scoped>
div {
	color: inherit;
}
</style>
