<template>
  <a-form :form="form">
    <a-form-item
      v-for="item in meta"
      :key="item.name"
      :label="$t(`setting.${settingType}.${item.name}`)"
      v-bind="layout"
    >
      <a-select :default-value="item.defaultValue" @change="onChange(item.handler, item.name, $event)">
        <a-select-option
          v-for="opt in item.options"
          :key="opt.value"
          :value="opt.value"
        >{{ opt.label }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: "setting-form",
  props: {
    meta: {
      type: Array,
      required: true,
      default: () => []
    },
    layout: {
      type: Object,
      default: () => ({
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      })
    },
    settingType: String,
  },
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  methods: {
    onChange(handler, key, val) {
      handler && handler(this, key, val);
    }
  }
};
</script>
