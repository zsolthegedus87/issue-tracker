<template lang="pug">
	ol.steps
		li.steps-segment(v-for="(step, index) in steps" :key="step", :class="{ 'is-active': stepActive === index + 1 }")
			span.steps-marker(:class="{ 'is-info': stepActive === index + 1 }")
				span.sr-only step
				span {{ index + 1  }}
				span.sr-only(v-if="stepActive > index + 1") completed step
				span.sr-only(v-if="stepActive === index + 1", aria-current="step") current step
				span.sr-only(v-if="stepActive < index + 1", aria-current="step") incomplete step
</template>

<script>
export default {
	name: "Steps",
	props: {
		steps: {
			type: Number,
			required: true
		},
		stepActive: {
			type: Number,
			default: 1
		},
	},
}
</script>

<style lang="scss" scoped>
.steps {
	list-style: none;
}
</style>
