<template>
  <div v-if="selectedImage" class="main-screen">
    <div :style="{ background: `url(${selectedImage}) center/cover no-repeat` }" class="hero-bg"></div>
    <div @click="getRandomBg()" class="change-bg-icon"></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      images: [],
      selectedImage: '',
    };
  },
  async mounted() {
    this.images = await this.getApiImages();
    this.selectedImage = this.images[this.randomNumber()].largeImageURL;
  },
  methods: {
    randomNumber() {
      return Math.floor(Math.random() * 200) + 1;
    },
    getApiImages() {
      return new Promise((resolve, reject) => {
        axios
          .get('https://pixabay.com/api/', {
            params: {
              key: '11002686-685122bed59c07caf3ac56d3f',
              per_page: 200,
            },
          })
          .then(response => {
            resolve(response.data.hits);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getRandomBg() {
      this.selectedImage = this.images[this.randomNumber()].largeImageURL;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-screen {
  position: absolute;
  width: 100%;
  height: 100vh;
}
.hero-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 5em 1em #000;
}
.change-bg-icon {
  background: url('/static/images/change-bg-icon.svg');
  position: absolute;
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
