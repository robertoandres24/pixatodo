<template>
  <div class="main-screen">
    <div class="hero-bg"></div>
    <div class="change-bg-icon"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
  background: radial-gradient(transparent, black), url('/static/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
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
