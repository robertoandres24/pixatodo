<template>
  <div class="main-screen">
    <div class="hero-bg" :style="{ background: `radial-gradient(transparent, black), center / cover no-repeat url('${image}')` }"></div>
    <div @click="getRandomBg()" class="change-bg-icon"></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      image: '',
    };
  },
  watch: {
    // whenever question changes, this function will run
    image: function(newImage, oldImage) {
      console.log(newImage, oldImage);
    },
  },
  computed: {
    randomNumber() {
      return Math.floor(Math.random() * 200) + 1;
    },
  },
  mounted() {
    this.getRandomBg();
  },
  methods: {
    getRandomBg() {
      console.log('clicked');
      // Optionally the request above could also be done as
      axios
        .get('https://pixabay.com/api/', {
          params: {
            key: '11002686-685122bed59c07caf3ac56d3f',
            per_page: 200,
          },
        })
        .then(response => {
          console.log(response.data.hits);
          this.image = response.data.hits[this.randomNumber].largeImageURL;
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.hero-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
