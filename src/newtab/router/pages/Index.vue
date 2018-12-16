<template>
  <div class="main-screen">
    <img ref="heroBg" src="/static/images/dog-bg.jpg" alt class="hero-bg blur" />
    <!-- <img ref="heroBg" class="hero-bg" /> -->
    <div @click="changeSelectedImage()" class="change-bg-icon"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      images: [],
      selectedImage: {}
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
    handlePreloaderBoot() {
      let heroBg = this.$refs.heroBg
      let largeImg = new Image()
      largeImg.onload = function() {
        heroBg.src = this.src
        heroBg.classList.remove('blur')
      }
      setTimeout(() => {
        largeImg.src = 'https://pixabay.com/get/ea3db70a2df1063ed1584d05fb1d4797e377e0d311b70c4090f4c570afe5b4bbda_1280.jpg'
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
      await this.getRandomBg()
      let heroBg = this.$refs.heroBg
      heroBg.classList.add('blur')
      heroBg.src = this.selectedImage.webformatURL
      let largeImg = new Image()
      largeImg.onload = function() {
        heroBg.src = this.src
        heroBg.classList.remove('blur')
      }
      largeImg.src = this.selectedImage.largeImageURL
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
  filter: blur(0);
  transition: all 1s ease;
  &.blur {
    filter: blur(10px);
  }
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
