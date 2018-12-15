<template>
  <div class="wrapper"><router-view></router-view></div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: black;
}
</style>
