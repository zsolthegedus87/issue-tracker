<template lang="pug">
div
	.message.is-danger(v-if="noData")
		.message-body
			h3 Error occured when querying data. Please try again!
	.list-issues
		.list-issues__filters.mb-4
			form(ref="filterForm", @submit.prevent="")
				.field-body
					.field
						label#list-issues-search-label.label(for="list-issues-search-input") Search by title or description
						.control
							input#list-issues-search-input.input(type="text", maxlength="50", @keyup="filteredList", v-model="filterIssues.search", aria-labelledby="list-issues-search-label", aria-describedby="list-issues-search-error", placeholder="Search in issues")
		transition-group(name="list-complete", mode="out-in" )
			DataCards.list-complete-item(v-for="(issue, index) in filteredList()" :key="issue.id")
				template(v-slot:title) {{ issue.title }}
				template(v-slot:content)
					p.tag.is-medium.priority.mb-4
						img.svg(:src="require(`@/assets/img/${issue.priority}.svg`)")
						| {{ issue.priority }}
					.field.is-grouped.is-grouped-multiline.mb-3
						.control(v-for="(tag, index) in issue.tags", :key="index", :id="`tag-${index}`")
							.tags.has-addons
								span.tag.is-primary {{ tag }}
					p.has-text-weight-bold Description
					p desc: {{ issue.description }}
					p id: {{ issue.id }}
					.box.box--preview-img(v-if="issue.imgUrl")
						img.preview-img(:src="issue.imgUrl")
				template(v-slot:footer)
					p.card-footer-item
						button.button.is-danger(@click="openModal(issue.id, index)")
							| delete
	Modal
		template(v-slot:head) Confirm delete
		template(v-slot:body)
			p Are you sure you want to delete this issue permanently?
		template(v-slot:footer)
			button.button.is-danger(@click="deleteIssue") Delete issue
			button.button(@click="closeModal") Cancel

</template>
<script>
import { db } from "@/firebase";
import DataCards from "@/components/common/DataCards";
import Modal from "@/components/common/Modal";
import { bus } from "@/main";
import firebase from "firebase/compat";

export default {
	name: "ListIssues",
	components: {
		DataCards,
		Modal,
	},
	data() {
		return {
			issuesList: null,
			noData: false,
			filterIssues: {
				search: "",
				results: null,
			},
			modalDetails: {
				issueId: null,
				index: null,
			},
			imagePaths: [],
		};
	},
	mounted() {
		const self = this;
		db.collection("issues")
			.get()
			.then((snapshot) => {
				let issues = [];
				snapshot.docs.forEach((doc) => {
					issues.push({ ...doc.data(), id: doc.id });
				});
				self.issuesList = issues;
			})
			.catch(function (error) {
				console.error("Error getting document:", error);
			});

		const storageRef = firebase.storage().ref("/issues-static");

		storageRef.listAll().then(function (res) {
			res.items.forEach((imageRef) => {
				imageRef.getDownloadURL().then((url) => {
					self.imagePaths.push(url);
				});
			});
		});
	},
	methods: {
		deleteIssue() {
			db.collection("issues").doc(this.modalDetails.issueId).delete();
			this.issuesList.splice(this.modalDetails.index, 1);
			bus.$emit("close-modal");
		},
		filteredList() {
			return this.issuesList.filter((issue) => {
				return (
					issue.title
						.toLowerCase()
						.includes(this.filterIssues.search.toLowerCase()) ||
					issue.description
						.toLowerCase()
						.includes(this.filterIssues.search.toLowerCase())
				);
			});
		},
		openModal: function (issueId, index) {
			this.modalDetails.issueId = issueId;
			this.modalDetails.index = index;
			bus.$emit("open-modal");
		},
		closeModal: function () {
			bus.$emit("close-modal");
		},
	},
};
</script>
<style lang="scss" scoped>
@import "../common/css/variables";

.list-issues {
	position: relative;
}

.list-complete-item {
	transition: all 0.5s;
}

.list-complete-leave-to {
	opacity: 0;
	transform: translateX(-400px);
}

.list-complete-leave-active {
	position: absolute;
	width: 100%;
}

.box--preview-img {
	display: flex;
	margin: 16px 0 8px;
	padding: 5px;
	width: 210px;
}
</style>
