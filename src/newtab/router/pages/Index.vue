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
    <div class="credits">
      <p>
        <label for="">Imágenes desde:</label
        ><a href="https://pixabay.com/">Pixabay</a>
      </p>
      <p class="dash">-</p>
      <p class="inspired-by">
        <label for=""> Inspirado por:</label>
        <a
          href="https://chrome.google.com/webstore/detail/wunderlist-new-tab/fgikemaeelgbhjnhnnahcpkjpafaeion?hl=es"
          >Wunderlist</a
        ><a href="https://momentumdash.com/">Momentum</a
        ><a href="https://www.infinitynewtab.com/">Infinity</a>
      </p>
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
      code: 'es',
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
    // ip and language stuff
    let myPublicIp = await this.getMyPublicIp()
    let ipInfo = await this.getIpInfo(myPublicIp)
    this.code = await this.getCode(ipInfo)

    console.log(this.code)
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
    },
    getMyPublicIp() {
      return new Promise((resolve, reject) => {
        axios
          .get('https://api.ipify.org?format=json')
          .then(response => {
            resolve(response.data.ip)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getIpInfo(myPublicIp) {
      return new Promise((resolve, reject) => {
        axios
          .get('http://api.ipstack.com/' + myPublicIp, {
            params: {
              access_key: 'c3d7cc7fe3f67423c53bf0f706d143e9',
              format: 1
            }
          })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCode(response) {
      return new Promise((resolve, reject) => {
        let code = response.data.location.languages[0].code
        if (code !== undefined) {
          resolve(code)
        }
        reject('unable to get country code')
      })
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
  background-image: url('/static/images/refresh.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 0;
  height: 50px;
  width: 50px;
  margin: 1rem;
  transition: all 1s ease;
  &:hover {
    cursor: pointer;
  }
  &.loading {
    animation: rotate 3s linear infinite;
  }
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
</style>
