<template>
  <div class="main-screen">
    <transition name="fade"> <img ref="heroBg" :src="selectedImage" v-show="heroLoaded" class="hero-bg" /> </transition>
    <div @click="changeSelectedImage()" class="change-bg-icon"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      heroLoaded: false,
      images: [],
      selectedImage: ''
    }
  },
  async mounted() {
    this.images = await this.getApiImages()
    await this.getRandomBg()
    this.handlePreloader()
  },
  methods: {
    handlePreloader() {
      let heroBg = this.$refs.heroBg
      heroBg.onload = () => {
        this.heroLoaded = true
        console.log('hero loaded')
      }
    },
    randomNumber() {
      return Math.floor(Math.random() * 200) + 1
    },
    getRandomBg() {
      return new Promise((resolve, reject) => {
        this.selectedImage = this.images[this.randomNumber()].largeImageURL
        resolve(this.selectedImage)
      })
    },
    async changeSelectedImage() {
      this.heroLoaded = false
      await this.getRandomBg()
      this.handlePreloader()
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

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
  &:hover {
    cursor: pointer;
  }
}
</style>
