<template>
  <div @dblclick="editTodo(todo)" :class="{ editing: todo == editedTodo }" class="todo">
    <label for>{{ todo.title }}</label>
    <label
      contenteditable="true"
      :ref="`editTodo-${todo.id}`"
      v-todo-focus="todo == editedTodo"
      @blur="doneEdit(todo)"
      @keydown.enter.exact.prevent
      @keyup.enter.exact="doneEdit(todo)"
      @keyup.esc="cancelEdit(todo)"
      class="edit"
      :id="`edit-${todo.id}`"
    ></label>
    <button @click="$emit('remove-todo', todo)" class="destroy"></button>
  </div>
</template>

<script>
import setCursorManager from '../../mixins/setCursorManager'
import emoji from '../../mixins/emoji'
export default {
	mixins: [setCursorManager, emoji],
	data() {
		return {
			editedTodo: null
		}
	},
	// a custom directive to wait for the DOM to be updated
	// before focusing on the input field.
	// http://vuejs.org/guide/custom-directive.html
	directives: {
		'todo-focus': function(el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	},
	props: {
		todo: {
			type: Object,
			required: true
		}
	},
	methods: {
		editTodo: function(todo) {
			// this.$refs.editTodo
			this.beforeEditCache = todo.title
			this.$refs[`editTodo-${todo.id}`].innerText = todo.title
			var editableDiv = this.$refs[`editTodo-${todo.id}`]
			cursorManager.setEndOfContenteditable(editableDiv)
			this.editedTodo = todo
		},
		doneEdit: function(todo) {
			const thisEl = this.$refs[`editTodo-${todo.id}`]
			if (!this.editedTodo) {
				return
			}
			if (this.creatingEmoji(thisEl)) {
				return
			}

			this.editedTodo = null
			todo.title = thisEl.innerText.trim()
			if (!todo.title) {
				this.removeTodo(todo)
			}
		},
		cancelEdit: function(todo) {
			this.editedTodo = null
			todo.title = this.beforeEditCache
		}
	}
}
</script>


<style lang="scss" scoped>
.todo label {
	width: 90%;
	display: block;
	padding: 0.5rem;
	margin: 0.8rem 0;
	overflow: hidden;
	line-height: 1.4em;
	user-select: text;
	white-space: pre-wrap;
	word-wrap: break-word;
}
.todo .edit {
	margin: 0;
	width: 90%;
	background: transparent;
	color: white;
	font-family: inherit;
	font-size: inherit;
	line-height: 1.4em;
	border: 0;
	padding: 0.5rem;
	margin: 0.8rem 0;
	display: none;
	&:focus {
		outline: none;
	}
}
.todo .destroy {
	opacity: 0;
	position: absolute;
	top: -0.5rem;
	right: -0.5rem;
	bottom: 0;
	width: 50px;
	height: 50px;
	margin: auto 0;
	font-size: 40px;
	color: white;

	background: transparent;
	transition: all 0.3s ease;
	border: none;
}
.todo {
	position: relative;
	border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}
.todo .destroy {
	&:hover {
		color: #aaa;
		cursor: pointer;
		& + label {
			text-decoration: line-through;
		}
	}
	&:after {
		content: '×';
	}
	&:focus {
		outline: none;
	}
}

.todo:hover .destroy {
	opacity: 1;
}
.todo.editing label {
	display: none;
}
.todo.editing .edit {
	display: block;
}
</style>
