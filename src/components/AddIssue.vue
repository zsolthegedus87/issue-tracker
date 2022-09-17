<template lang="pug">
div
	.box(v-if="!submitted")
		keep-alive
			form(ref="issueForm", @submit.prevent="createIssue")
				.field
					label#issue-title-label.label(for="issue-title-input") Title
					.control
						input#issue-title-input.input(:class="{ 'is-danger': $v.issue.title.$error }", type="text", maxlength="50", v-model="issue.title", @blur="$v.issue.title.$touch()", aria-labelledby="issue-title-label", aria-describedby="issue-title-error", :aria-invalid="$v.issue.title.$error", placeholder="First name")
						p#issue-title-error.help(:class="{ 'is-danger': $v.issue.title.$error }", aria-live="assertive", v-if="$v.issue.title.$dirty && !$v.issue.title.required") Title is required
				.field
					label#issue-description-label.label(for="issue-description-input") Description
					.control
						textarea#issue-description-input.textarea(:class="{ 'is-danger': $v.issue.description.$error }", type="text", maxlength="150" v-model="issue.description", @blur="$v.issue.description.$touch()", aria-labelledby="issue-description-label", aria-describedby="issue-description-error", :aria-invalid="$v.issue.description.$error", placeholder="Description")
						p.counter {{ charactersLeft }}
						p#issue-description-error.help(:class="{ 'is-danger': $v.issue.description.$error }", aria-live="assertive", v-if="$v.issue.description.$dirty && !$v.issue.description.required") Description is required
				.field
					.label
						label#issue-priority-label.label(for="issue-priority-select") Priority
					.control
						.select
							select#issue-priority-select(name="issue-priority-select", v-model="issue.priority", aria-labelledby="issue-priority-label")
								option(value="low", selected) Low
								option(value="medium") Medium
								option(value="high") High
								option(value="blocker") Blocker
				.field
					p.label File upload
					.file.is-small(:class="{ 'has-name': imageData }" v-if="uploadValue === 0")
						label.file-label
							input.file-input(ref="inputUpload" type="file" @change="previewImage" accept="image/*")
							span.file-cta
								span.file-icon
									i.fas.fa-upload
								span.file-label
									| Choose a file…
							span.file-name(v-if="imageName")
								| {{ imageName }}
					br
					template(v-if="onUploadInProgress")
						p Progress: {{uploadValue.toFixed()+"%"}}
						progress#progress.progress.is-primary(:value="uploadValue" max="100")
					.box.box--preview-img(v-if="imageData")
							img.preview-img(:src="pictureSrc" @click="resetFileUpload")
					button.button.is-primary(v-if="!onUploadInProgress" type="button" @click="onUpload") upload
				.field
					label#issue-tags-label.label(for="issue-tags-input") Tags
					.control.mb-3
						input#issue-tags-input.input(type="text", v-model="tagsInput", v-on:keydown.enter.prevent="onEnter", :disabled="this.issue.tags.length > 9" aria-labelledby="issue-tags-label", aria-describedby="issue-tags-error", placeholder="Assign to ")
						p#issue-tags-error.help(:class="{ 'is-danger': this.issue.tags.length > 9 }", aria-live="assertive", v-if="this.issue.tags.length > 9") That should be enough tag, you've reached the limit
					.field.is-grouped.is-grouped-multiline
						.control(v-for="(tag, index) in issue.tags", :key="index", :id="`tag-${index}`")
							.tags.has-addons
								span.tag {{ tag }}
								a.tag.is-delete(@click="onDeleteTag(index)")
				.level
					.level-item.has-text-centered
					div
						button.button.is-primary() create issue
	.message.is-info(v-show="preCreatedIssue && !submitted", ref="issueCard")
		.message-header
			h3 Your Ticket
		.message-body
			DataCards
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
					p {{ issue.description }}
				template(v-slot:footer)
					p.card-footer-item
						a.button.is-warning.is-danger(@click="deleteIssue") delete
					p.card-footer-item
						button.button.is-warning.is-success(type=submit, @click="sendData") send
	.message.is-success(v-if="submitted", ref="successMessage")
		.message-header
			h3 Success
		.message-body.message-body--success.is-flex.is-flex-wrap-wrap
			img.svg(src="../assets/img/success.svg")
			.message-body__content
				p Your ticket has been created!
				p.is-size-7 issue id: {{ token }}
			.message-body__button.mt-4
				button.button.is-primary(@click="deleteIssue") Add new issue
	br
</template>
<script>
import firebase from "firebase/compat/app";
import { db } from "@/firebase";
import { required } from "vuelidate/lib/validators";
import DataCards from "@/components/common/DataCards";

export default {
	name: "Form",
	components: {
		DataCards,
	},
	data() {
		return {
			technicalError: false,
			issue: {
				title: "",
				description: "",
				priority: "low",
				tags: [],
				imgUrl: "",
			},
			tagsInput: "",
			preCreatedIssue: false,
			submitted: false,
			token: null,
			imageData: null,
			imageName: null,
			pictureSrc: null,
			uploadValue: 0,
			onUploadInProgress: false
		};
	},
	validations: {
		issue: {
			title: { required },
			description: { required },
		},
	},
	methods: {
		createIssue() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.preCreatedIssue = true;
				this.goTo("issueCard");
			}
		},
		deleteIssue() {
			this.$v.$reset();
			Object.assign(this.$data, this.$options.data.call(this));
			this.goTo();
		},
		sendData() {
			const self = this;
			db.collection("issues")
				.add(this.issue)
				.then(function (docRef) {
					self.token = docRef.id;
					self.onUpload(self.token);
				})
				.catch(function (error) {
					console.error("Error sending form: ", error);
				});
			this.submitted = true;
		},
		onEnter() {
			if (
				this.tagsInput &&
				/^[a-zA-Z0-9_.-]*$/.test(this.tagsInput) &&
				!this.issue.tags.includes(this.tagsInput)
			) {
				this.issue.tags.push(this.tagsInput);
				this.tagsInput = "";
			} else {
				this.tagsInput = "";
			}
		},
		onDeleteTag(index) {
			this.issue.tags.splice(index, 1);
		},
		goTo(refName) {
			let element = 0;

			if (refName) {
				element = this.$refs[refName];
			}

			this.$nextTick(() => {
				window.scrollTo({
					top: refName ? element.offsetTop : 0,
					left: 0,
					behavior: 'smooth'
				});
			});
		},
		previewImage(event) {
			this.uploadValue = 0;
			this.pictureSrc = null;
			this.imageData = event.target.files[0];
			this.imageName = event.target.files[0].name;
			this.imageType = this.imageName.split(".").pop();
			this.pictureSrc = URL.createObjectURL(event.target.files[0]);
		},
		resetFileUpload() {
			this.pictureSrc = null;
			this.imageData = null;
			this.imageName = null;
			this.$refs.inputUpload.value = null;
		},
		onUpload(id) {
			this.onUploadInProgress = true;
			this.pictureSrc = null;
			const storageRef = firebase
				.storage()
				.ref(`issues-static/${id}.${this.imageType}`)
				.put(this.imageData);
			storageRef.on(
				`state_changed`,
				(snapshot) => {
					this.uploadValue =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				},
				(error) => {
					console.log(error.message);
					this.onUploadInProgress = false;
				},
				() => {
					this.uploadValue = 100;
					storageRef.snapshot.ref.getDownloadURL().then((url) => {
						this.pictureSrc = url;
						this.issue.imgUrl = url;
					});
				}
			);
		},
	},
	computed: {
		charactersLeft() {
			const char = this.issue.description.length,
				limit = 150;

			return limit - char + " / " + limit;
		}
	},
};
</script>
<style lang="scss" scoped>
@import "../common/css/variables";

html {
	scroll-behavior: smooth;
}

.message-body--success .svg {
	margin-right: 10px;
	width: 40px;
}

.message-body__button {
	flex: 100%;
}

.box--preview-img {
	display: flex;
	margin: 6px auto;
	padding: 5px;
	width: 100px;
}

.preview-img {
	position: relative;
}

.preview-img:hover::after {
	content: "x";
	display: inline-block;
	height: 20px;
	left: 20px;
	position: absolute;
	top: 20px;
	width: 20px;
}

.control {
	position: relative;
}

.counter {
	bottom: 6px;
	font-size: 12px;
	position: absolute;
	right: 12px;
}
</style>
