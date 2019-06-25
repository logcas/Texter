<template>
  <div class="about">
    <img src="@/assets/logo.png">
    <p class="sologan">Write in a good mood</p>
  </div>
</template>

<script>
export default {
  name: 'texter-about'  
}
</script>

<style lang="scss" scoped>
.about {
  text-align: center;
  padding: 50px;
  user-select: none;

  .sologan {
    margin-top: 50px;
    font-size: 30px;
  }
}
</style>

