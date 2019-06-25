<template>
  <div>
    <a-tooltip placement="right">
      <template slot="title">
        <span>{{ $t('navigator.newFile') }}</span>
      </template>
      <a-button type="default" shape="circle" icon="plus" size="large" @click="showModal"/>
    </a-tooltip>
    <a-modal v-model="visible" :title="$t('tapSide.newFile.title')">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">{{ $t('system.cancel') }}</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="onCreate">{{ $t('system.create') }}</a-button>
      </template>
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="$t('tapSide.newFile.documentType')"
        >
          <a-radio-group v-model="documentType">
            <a-radio-button value=".md">{{ $t('tapSide.newFile.markdownType') }}</a-radio-button>
            <a-radio-button value=".txt">{{ $t('tapSide.newFile.textType') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="$t('tapSide.newFile.newFileName')"
        >
          <a-input
            v-decorator="[
          'filename',
          {rules: [{ required: true, message: $t('tapSide.newFile.newFileNameTip') }]}
        ]"
            :placeholder="$t('tapSide.newFile.newFileNameTip')"
            :addonAfter="documentType"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="$t('tapSide.newFile.newFilePath')"
        >
          <a-input-search
            v-decorator="[
          'path',
          {rules: [{ required: true, message: $t('tapSide.newFile.newFilePathTip') }]}
        ]"
            :placeholder="$t('tapSide.newFile.newFilePathTip')"
            @search="onGetPath"
            enterButton
            readonly
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("File");
const { ipcRenderer } = require("electron");
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 4 }
};
export default {
  name: "newfile-modal",
  data() {
    return {
      visible: false,
      loading: false,

      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),
      documentType: ".md"
    };
  },
  methods: {
    ...mapActions(["addFile", "setCurrentFile"]),
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    onGetPath() {
      this.form.validateFields(["filename"], err => {
        if (!err) {
          let filename =
            this.form.getFieldValue("filename") + this.documentType;
          ipcRenderer.send("requestPath", {
            title: this.$t('tapSide.newFile.newFilePathTip'),
            defaultPath: filename,
            type: "newFile"
          });
        }
      });
    },
    onCreate() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const { filename, path } = values;
          let file = {
            path,
            name: filename + this.documentType,
            content: "# Hello,world",
            lastModified: new Date().getTime(),
            saveAfterModified: true
          };
          ipcRenderer.send("saveFile", file);
          this.addFile(file);
          this.setCurrentFile(path);
          this.visible = false;
        }
      });
    }
  },
  created() {
    ipcRenderer.on("responsePath-newFile", (e, path) => {
      if (!path) return;
      this.form.setFieldsValue({
        path
      });
    });
  }
};
</script>
