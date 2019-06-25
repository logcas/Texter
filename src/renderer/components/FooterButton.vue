<template>
  <span class="footer-button">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'footer-button'
}
</script>

<style lang="scss" scoped>
.footer-button {
  color: #fff;
  user-select: none;
  padding: 2px 4px;
  border-radius: 2px;

  &:hover {
    color: #74b1be;
    background: #404458;
    cursor: pointer;
  }
}
</style>

