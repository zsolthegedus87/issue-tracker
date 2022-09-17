<template lang="pug">
	section
		.column.is-half.is-offset-one-quarter
			h1.mb-3.is-size-3.is-size-3-mobile.has-text-weight-bold.has-text-centered Add Issue
			AddIssue


</template>
<script>
// @ is an alias to /src
import AddIssue from "@/components/AddIssue";

export default {
	name: "AddIssueView",
	components: {
		AddIssue,
	},
};
</script>


<style lang="scss" scoped>
div {
	color: inherit;
}
</style>
