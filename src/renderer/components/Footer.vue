<template>
  <div class="main-footer">
    <footer-button @click.native="setMode">{{ mode }}</footer-button>
  </div>
</template>

<script>
import FooterButton from './FooterButton';
export default {
  name: 'main-footer',
  props: {
    mode: String
  },
  components: {
    [FooterButton.name]: FooterButton
  },
  methods: {
    setMode() {
      console.log('setmode');
    }
  }
}
</script>

<style lang="scss" scoped>
.main-footer {
  height: 30px;
  line-height: 30px;
  background: #2f3241;
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
}
</style>


