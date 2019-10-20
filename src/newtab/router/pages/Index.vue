<template>
  <div class="main-screen">
    <img ref="heroBg" :src="bgImage ? bgImage.urls.small: ''" alt class="hero-bg blur" />
    <div class="overlay"></div>
    <div class="content">
      <!-- TODO: create span that act like placeholder -->
      <div
        id="createTodo"
        class="create-todo"
        ref="newTodo"
        contenteditable="true"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="addTodo()"
      ></div>
      <div v-show="todos.length" class="todo-list">
        <Todo
          @if-is-emoji-creating="creatingEmoji"
          @remove-todo="removeTodo"
          v-for="(todo, index) in todos"
          :todo="todo"
          :key="index"
        />
      </div>
    </div>
    <div class="credits">
      <a href="https://github.com/robertoandres24/pixatodo">
        <span class="icon github-icon"></span>
      </a>
      <span v-if="bgImage" class="unsplash">
        Photo by
        <a :href="linkToAuthor">{{bgImage.user.name}}</a> on
        <a :href="linkToUnsplash">Unsplash</a>
      </span>
    </div>
    <searchBgImage @search-image="searchImage" />
  </div>
</template>

<script>
import searchBgImage from '../../components/SearchBgImage'
import Todo from '../../components/Todo'
import emoji from '../../../mixins/emoji'
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
	mixins: [emoji],
	components: { searchBgImage, Todo },
	data() {
		return {
			newTodo: '',
			todos: this.$localStorage.todoStorage.fetch(),
			bgImage: this.$localStorage.currentBg.fetch(),
			tag: this.$localStorage.currentTag.fetch(),
			defaultBgLow: '/static/images/best-friend-low.jpg',
			defaultBgHigh: '/static/images/best-friend-high.jpg',
			persons: [
				{ name: 'guiño', emojiCode: '1F609' },
				{ name: 'alegria', emojiCode: '1F602' },
				{ name: 'cara invertida', emojiCode: '1F643' },
				{ name: 'hash', emojiCode: '0023-FE0F-20E3' },
				{ name: 'flag', emojiCode: '1F1E6-1F1E8' }
			]
		}
	},
	computed: {
		linkToAuthor() {
			return `https://unsplash.com/@${
				this.bgImage.user.username
			}?utm_source=pixatodo&utm_medium=referral`
		},
		linkToUnsplash() {
			return 'https://unsplash.com/?utm_source=pixatodo&utm_medium=referral'
		},
		pendingTasks() {
			if (this.todos.length) {
				return 'My pending Tasks'
			}
			return 'Create your task'
		}
	},

	// watch todos change for localStorage persistence
	watch: {
		todos: {
			handler: function(todos) {
				this.$localStorage.todoStorage.save(todos)
			},
			deep: true
		}
	},
	async mounted() {
		await this.handlePreloaderBoot()
		$('div#createTodo').tagautocomplete({
			source: this.persons,
			character: ':', //accept both @ and #,
			renderKey: 'emojiCode'
		})
	},

	updated() {
		this.initializeTagAutocompleteEditLabels()
	},
	methods: {
		...mapActions(['getRandomImage', 'triggeringDownloadEndpoint']),
		initializeTagAutocompleteEditLabels() {
			this.todos.forEach(todo => {
				$(`#edit-${todo.id}`).tagautocomplete({
					source: this.persons,
					character: ':', //accept both @ and #,
					renderKey: 'emojiCode'
				})
			})
		},
		addTodo(e) {
			let value = this.$refs.newTodo.innerText.trim()
			if (!value) {
				this.$refs.newTodo.innerText = ''
				return
			}
			if (this.creatingEmoji(this.$refs.newTodo)) {
				return
			}
			this.todos.push({
				id: this.$localStorage.todoStorage.uid++,
				title: value,
				completed: false
			})
			this.$refs.newTodo.innerText = ''
		},
		removeTodo(todo) {
			this.todos.splice(this.todos.indexOf(todo), 1)
		},
		loadBgImageDefault(heroBg) {
			this.$localStorage.currentBg.destroy()
			heroBg.src = this.defaultBgHigh
			heroBg.classList.remove('blur')
			this.$localStorage.currentTag.destroy()
		},
		handlePreloaderBoot() {
			if (this.bgImage) {
				this.loadNewImageInDom(this.bgImage)
				return
			}
			this.getRandomImage('')
				.then(imgObj => {
					this.bgImage = imgObj
					this.loadNewImageInDom(imgObj)
				})
				.catch(e => {
					this.loadBgImageDefault(this.$refs.heroBg)
				})
		},

		loadNewImageInDom(bgImage) {
			let heroBg = this.$refs.heroBg
			heroBg.classList.add('blur')
			heroBg.src = bgImage.urls.small
			let largeImg = new Image()
			largeImg.src = bgImage.urls.full
			largeImg.onload = function() {
				heroBg.src = this.src
				heroBg.classList.remove('blur')
			}
			largeImg.onerror = () => {
				this.loadBgImageDefault(this.$refs.heroBg)
			}
			this.$localStorage.currentBg.save(bgImage)
		},

		async searchImage(query = '') {
			this.getRandomImage(query)
				.then(imgObj => {
					this.bgImage = imgObj
					this.loadNewImageInDom(imgObj)
					this.$localStorage.currentTag.save(query)
				})
				.catch(e => this.loadBgImageDefault(this.$refs.heroBg))
		}
	}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato');

//typeahead
.typeahead {
	z-index: 999;
	font-size: 20px;
	color: #fff;
	background: #666;
	width: 100%;
	a {
		color: #fff;
		text-decoration: none;
		padding: 7px;
		display: block;
	}
	li.active {
		background: #aaa;
	}
}

.content {
	position: relative;
	width: 600px;
	margin: 0 auto;
	padding: 100px 0;
	z-index: 3;
}

.create-todo {
	width: 100%;
	max-height: 200px;
	overflow: auto;
	font-size: 2.5rem;
	font-weight: normal;
	border: none;
	outline: none;
	border-bottom: 2px solid white;
	color: #fff;
	padding-bottom: 0.2rem;
	user-select: text;
	white-space: pre-wrap;
	word-wrap: break-word;

	&::placeholder {
		font-style: italic;
		font-size: 2.6rem;
		font-weight: 100;
		color: #fff6;
		text-indent: 0.5rem;
	}
}
.todo-list {
	font-family: helvetica;
	font-size: 1.6rem;
	margin-top: 2.5rem;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.main-screen {
	position: relative;
	width: 100%;
	min-height: 100vh;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: inset 0 0 5em 1em #000;
		z-index: 1;
	}
}
.hero-bg {
	position: fixed;
	z-index: 1;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
	filter: blur(0);
	transition: all 1s ease;
	&.blur {
		filter: blur(10px);
	}
}
.overlay {
	position: absolute;
	z-index: 2;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: #000;
	opacity: 0.5;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

/** Credits */
.credits {
	position: fixed;
	z-index: 4;
	left: 0;
	bottom: 0;
	margin: 1.5rem 2rem;
	font-size: 0.8rem;
	display: flex;
	color: #ddd;
	* {
		color: #ddd;
		display: inline-block;
		transition: all 1s ease;
	}
	> * {
		height: 1.5rem;
		margin: 0 0.5rem;
		display: flex;
		align-items: center;
	}
	.icon {
		height: 1.5rem;
		width: 1.5rem;
	}
	.icon {
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.github-icon {
		background-image: url(/static/images/github-white.svg);
	}
	.unsplash a {
		margin: 0 0.3rem;
	}
}
</style>
