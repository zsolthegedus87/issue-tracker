<template lang="pug">
	.card.mb-4
		.card-content
			h4.title.is-4
				slot(name="title") Title default
			slot(name="content") Content default
		.card-footer
			slot(name="footer")
</template>

<script>
export default {
	name: "DataCards",
};
</script>
<style lang="scss">
.card-content .svg {
	margin-right: 5px;
	width: 20px;
	vertical-align: sub;
}
</style>

