<template>
  <div class="main-screen">
    <img ref="heroBg" :src="bgImage ? bgImage.low : defaultBgLow" alt class="hero-bg blur">
    <div class="overlay"></div>
    <div class="content">
      <div class="create-todo">
        <input type="text" :placeholder="pendingTasks" v-model="newTodo" @keyup.enter="addTodo">
      </div>
      <div v-show="todos.length" class="todo-list">
        <div
          @dblclick="editTodo(todo)"
          v-for="(todo, index) in todos"
          :key="index"
          class="todo"
          :class="{ editing: todo == editedTodo }"
        >
          <button @click="removeTodo(todo)" class="destroy"></button>
          <label for>{{ todo.title }}</label>
          <input
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
            type="text"
            class="edit"
          >
        </div>
      </div>
    </div>
    <div class="credits">
      <a href="https://github.com/robertoandres24/pixatodo">
        <span class="icon github-icon"></span>
      </a>
    </div>
    <nav class="menu menu--floating" role="navigation">
      <a
        @click.prevent="changeSelectedImage('animals')"
        class="menu--floating__action"
        data-label="Animals"
      >
        <span class="icon">
          <i class="icofont-bear-face"></i>
        </span>
      </a>
      <a
        @click.prevent="changeSelectedImage('music')"
        class="menu--floating__action"
        data-label="Music"
      >
        <span class="icon">
          <i class="icofont-music"></i>
        </span>
      </a>
      <a
        @click.prevent="changeSelectedImage('sports')"
        class="menu--floating__action"
        data-label="Sports"
      >
        <span class="icon">
          <i class="icofont-football"></i>
        </span>
      </a>
      <a
        @click.prevent="changeSelectedImage('nature')"
        class="menu--floating__action"
        data-label="Nature"
      >
        <span class="icon">
          <i class="icofont-hill-sunny"></i>
        </span>
      </a>
      <a
        @click.prevent="changeSelectedImage('science')"
        class="menu--floating__action"
        data-label="Science"
      >
        <span class="icon">
          <i class="icofont-brainstorming"></i>
        </span>
      </a>

      <a
        ref="changeBgIcon"
        @click.prevent="changeSelectedImage()"
        class="menu--floating__action primary"
        data-label="Random"
      ></a>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      selectedImage: {},
      newTodo: '',
      editedTodo: '',
      todos: this.$localStorage.todoStorage.fetch(),
      bgImage: this.$localStorage.currentBg.fetch(),
      defaultBgLow: '/static/images/best-friend-low.jpg',
      defaultBgHigh: '/static/images/best-friend-high.jpg'
    }
  },
  computed: {
    pendingTasks() {
      if (this.todos.length) {
        return 'My pending Tasks'
      }
      return 'Create your task'
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
  },
  methods: {
    addTodo() {
      let value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: this.$localStorage.todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },
    editTodo: function(todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },
    cancelEdit: function(todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },
    handlePreloaderBoot() {
      let heroBg = this.$refs.heroBg
      let largeImg = new Image()
      let newBg = this.bgImage ? this.bgImage.high : this.defaultBgHigh
      setTimeout(() => {
        largeImg.src = newBg
      }, 50)
      largeImg.onload = function() {
        heroBg.src = this.src
        heroBg.classList.remove('blur')
      }
      largeImg.onerror = () => {
        this.$localStorage.currentBg.destroy()
        heroBg.src = this.defaultBgHigh
        heroBg.classList.remove('blur')
      }
    },
    getRandomPage() {
      return new Promise(resolve => {
        let rndNumber = Math.floor(Math.random() * (500 / 3)) + 1
        resolve(rndNumber)
      })
    },
    async changeSelectedImage(category = '') {
      let changeBgIcon = this.$refs.changeBgIcon
      changeBgIcon.classList.add('loading')
      let randomPage = await this.getRandomPage()
      this.selectedImage = await this.$store.dispatch('getApiImage', {
        category: category,
        page: randomPage
      })
      let heroBg = this.$refs.heroBg
      heroBg.classList.add('blur')
      heroBg.src = this.selectedImage.webformatURL
      let largeImg = new Image()
      largeImg.onload = function() {
        heroBg.src = this.src
        heroBg.classList.remove('blur')
        changeBgIcon.classList.remove('loading')
      }
      largeImg.src = this.selectedImage.largeImageURL
      //add new default bgImage to local Storage
      let newBgDefault = {
        low: this.selectedImage.webformatURL,
        high: this.selectedImage.largeImageURL
      }
      this.$localStorage.currentBg.save(newBgDefault)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato');

.credits {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  margin: 1rem;
  font-size: 0.8rem;
  display: flex;
  color: #ddd;
  label {
    margin-right: 0.5rem;
  }
  a {
    color: #ddd;
  }
  .dash {
    margin: 0 1rem;
  }
  .inspired-by a {
    margin-right: 0.5rem;
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
  input {
    width: 100%;
    font-size: 3rem;
    font-weight: normal;
    background: transparent;
    border: none;
    outline: none;
    border-bottom: 2px solid white;
    color: #fff;
    padding-bottom: 0.2rem;
    &::placeholder {
      font-style: italic;
      font-size: 2.6rem;
      font-weight: 100;
      color: #fff6;
      text-indent: 0.5rem;
    }
  }
}
.todo-list {
  font-family: helvetica;
  font-size: 1.6rem;
  margin-top: 2.5rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .todo label {
    width: 90%;
    display: block;
    padding: 0.5rem;
    margin: 0.8rem 0;
    overflow: hidden;
    line-height: 1.4em;
    cursor: pointer;
  }
  .todo input.edit {
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
    display: none;
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
    transition: color 0.2s ease-out;
    border: none;
  }
  .todo {
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
  .todo .destroy {
    &:hover {
      color: red;
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
    display: block;
  }
}

.todo-list .todo.editing label {
  display: none;
}
.todo-list .todo.editing .edit {
  display: block;
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

.github-icon {
  background-image: url(/static/images/github-white.svg);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  z-index: 2;
  height: 1.5rem;
  width: 1.5rem;
  bottom: 0;
  left: 0;
  margin: 1rem;
  transition: all 1s ease;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* floating action button styles*/

.menu--floating {
  bottom: 0;
  position: fixed;
  margin: 1em;
  right: 0;
  z-index: 2;
}

.menu--floating__action {
  // icon options
  .icon {
    display: block;
    width: 30px;
    height: 30px;
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    i {
      font-size: 30px;
      color: #fff;
    }
  }
  //labels of gray items
  &:before {
    bottom: 25%;
    color: #fff;
    content: attr(data-label);
    font-size: 14px;
    line-height: 1;
    opacity: 0;
    padding: 0.25em 1em;
    position: absolute;
    right: 100%;
    text-align: left;
    transition: opacity 0.2s ease-out 0.5s;
    white-space: nowrap;
  }
  // label of main action btn
  &:last-child {
    &:before {
      font-size: 16px;
    }
  }
  //main circle btn
  display: block;
  position: relative;
  height: 40px;
  width: 40px;
  margin: 10px auto 0;
  transition: all 0.2s linear;
  text-decoration: none;

  &.primary {
    background-image: url('/static/images/refresh.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    &.loading {
      &:before {
        display: none;
      }
      animation: rotate 3s linear infinite;
    }
  }

  &:hover {
    cursor: pointer;
  }

  //every gray circle option
  &:not(:last-child) {
    height: 44px;
    line-height: 2.5;
    opacity: 0;
    transform: translateY(50px);
    width: 44px;

    @for $i from 1 through 6 {
      &:nth-last-child(#{$i}) {
        transition-delay: $i * 50ms;
      }
    }
    &:hover {
      .icon i {
        color: #aaa;
      }
      &:before {
        color: #aaa;
      }
    }
  }
}
//when hover main section, give opacity to gray circles and their labels
.menu--floating:hover,
.menu--floating--open {
  .menu--floating__action {
    opacity: 1;
    transform: none;

    &:before {
      opacity: 1;
    }
  }
}
</style>
