<template lang="pug">
	.modal(:class="{ 'is-active': isActive }")
		.modal-background(@click="closeModal")
		.modal-card
			header.modal-card-head
				p.modal-card-title
					slot(name="head")
						| Modal title default
				slot(name="closeBtn")
					button.delete(aria-label='close', @click="closeModal")
			section.modal-card-body
				slot(name="body")
					p Modal body default
			footer.modal-card-foot
				slot(name="footer")
					p Modal footer default
</template>
<script>
import { bus } from "@/main";
export default {
	name: "Modal",
	data() {
		return {
			issuesList: null,
			isActive: false,
		};
	},
	created() {
		bus.$on("open-modal", () => {
			this.isActive = true;
		}),
		bus.$on("close-modal", () => {
			this.isActive = false;
		});
	},
	methods: {
		closeModal() {
			this.isActive = false;
		},
	}
};
</script>
