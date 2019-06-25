<template>
  <div class="filebar">
    <filebar-item v-for="file in fileListArray" :key="file.path" :file="file"/>
    <div class="empty-tip" v-show="fileListArray.length === 0">
      <a-icon type="file" />
      <p class="text">{{ $t('fileBar.emptyFileTip') }}</p>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import FilebarItem from './FileBarItem';
const { mapGetters } = createNamespacedHelpers('File'); 

export default {
  name: 'filebar',
  components: {
    [FilebarItem.name]: FilebarItem
  },
  computed: {
    ...mapGetters([
      'fileList'
    ]),
    fileListArray() {
      let arr = [];
      for(let path in this.fileList) {
        if(this.fileList.hasOwnProperty(path)) {
          arr.push(this.fileList[path]);
        }
      }
      return arr;
    }
  }
}
</script>

<style lang="scss" scoped>
.filebar {
  position: relative;
  width: 240px;
  height: 100%;
  background: #FAFAFA;
  overflow: auto;

  .empty-tip {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    padding: 10px;
    transform: translateY(-50%);
    font-size: 50px;
    text-align: center;
    user-select: none;
    cursor: default;

    .text {
      font-size: 16px;
    }
  }
}
</style>

