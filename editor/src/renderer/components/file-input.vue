<template>
  <div>
    <v-text-field v-model="filename" @click.native="onFocus" single-line :label="label"></v-text-field>
    <input ref="fileInput" type="file" v-on:change="fileSelected" class="btn-file" />
  </div>
</template>

<script>
  export default {
    name: 'upload-button',
    props: {
      label: {
        type: String,
      },
    },
    data() {
      return {
        filename: '',
      };
    },
    methods: {
      onFocus() {
        if (!this.disabled) {
          this.$refs.fileInput.click();
        }
      },
      fileSelected(e) {
        const files = e.target.files;
        if (files) {
          if (files.length > 0) {
            this.filename = files[0].path;
          } else {
            this.filename = null;
          }
        } else {
          this.filename = e.target.value.split('\\').pop();
        }
        this.$emit('input', this.filename);
      },
    },
  };
</script>

<style scoped>
  input[type=file].btn-file {
    position: absolute;
    top: -99999px;
    right: -999999px;
  }
</style>