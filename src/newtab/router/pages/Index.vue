<template>
  <div class="main-screen">
    <img
      ref="heroBg"
      :src="bgImage ? bgImage.low : defaultBg"
      alt
      class="hero-bg blur"
    />
    <div class="overlay"></div>
    <div class="create-todo">
      <input
        type="text"
        :placeholder="pendingTasks"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </div>
    <div v-show="todos.length" class="todo-list">
      <div
        @click="removeTodo(todo)"
        class="todo"
        v-for="(todo, index) in todos"
        :key="index"
      >
        {{ todo.title }}
      </div>
    </div>
    <div
      ref="changeBgIcon"
      @click="changeSelectedImage()"
      class="change-bg-icon"
    ></div>
  </div>
</template>

<script>
import axios from 'axios'
// localStorage persistence
var STORAGE_KEY = 'pixatodo-todos'
var BGIMAGE_KEY = 'bgImage'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
var currentBg = {
  fetch: function() {
    var image = JSON.parse(localStorage.getItem(BGIMAGE_KEY))
    return image
  },
  save: function(imgSource) {
    localStorage.setItem(BGIMAGE_KEY, JSON.stringify(imgSource))
  }
}

export default {
  data() {
    return {
      images: [],
      selectedImage: {},
      newTodo: '',
      todos: todoStorage.fetch(),
      bgImage: currentBg.fetch(),
      defaultBg: '/static/images/best-friend-low.jpg'
    }
  },
  computed: {
    pendingTasks() {
      if (this.todos.length) {
        return 'Mis tareas pendientes'
      }
      return 'Crea tu tarea'
    }
  },
  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },
  async mounted() {
    // get 200 images
    this.images = await this.getApiImages()
    // get 1 image random
    await this.getRandomBg()
    this.handlePreloaderBoot()
  },
  methods: {
    addTodo() {
      let value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },
    handlePreloaderBoot() {
      let heroBg = this.$refs.heroBg
      let largeImg = new Image()
      largeImg.onload = function() {
        heroBg.src = this.src
        heroBg.classList.remove('blur')
      }
      let currentBg = this.bgImage
        ? this.bgImage.high
        : '/static/images/best-friend-high.jpg'
      setTimeout(() => {
        largeImg.src = currentBg
      }, 50)
    },
    randomNumber() {
      return Math.floor(Math.random() * 200) + 1
    },
    getRandomBg() {
      return new Promise((resolve, reject) => {
        this.selectedImage = this.images[this.randomNumber()]
        resolve(this.selectedImage)
      })
    },
    async changeSelectedImage() {
      let changeBgIcon = this.$refs.changeBgIcon
      changeBgIcon.classList.add('loading')
      await this.getRandomBg()
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
      currentBg.save(newBgDefault)
    },
    getApiImages() {
      return new Promise((resolve, reject) => {
        axios
          .get('https://pixabay.com/api/', {
            params: {
              key: '11002686-685122bed59c07caf3ac56d3f',
              per_page: 200
            }
          })
          .then(response => {
            resolve(response.data.hits)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato');
.create-todo {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  width: 600px;
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
      font-weight: 100;
      color: #fff;
      text-indent: 0.5rem;
    }
  }
}
.todo-list {
  font-family: helvetica;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  width: 600px;
  font-size: 1.6rem;
  .todo {
    width: 100%;
    margin: 0.8rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding: 0.8rem 0;
    overflow: hidden;
    font-weight: lighter;
    cursor: pointer;
    &:hover {
      text-decoration: line-through;
    }
  }
}
.main-screen {
  position: absolute;
  width: 100%;
  height: 100vh;
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
  position: absolute;
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
.change-bg-icon {
  background: url('/static/images/change-bg-icon.svg');
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 0;
  height: 100px;
  width: 100px;
  margin: 1rem;
  transition: all 1s ease;
  &:hover {
    cursor: pointer;
  }
  &.loading {
    animation: rotate 3s infinite;
  }
}

@keyframes rotate {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
