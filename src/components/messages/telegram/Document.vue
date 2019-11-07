<template lang="pug">
v-list-item-title.message-text 
    v-container(fluid)
        v-row(dense :justify="mobile()")
            v-col(md="auto").col_nogrow
                v-btn(fab outlined small color="indigo" :loading="loading" :disabled="disabled" @click="loadSticker") 
                    v-icon mdi-download
            v-col(md="auto")
                div(class="caption" v-if="message.raw.document.file_name") {{message.raw.document.file_name}}
                div(class="caption") {{filesize(message.raw.document.file_size)}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../../../utils/api";
import * as store from "../../../plugins/store/store";

@Component({
  props: ["message"]
})
export default class TelegramDocumentMessage extends Vue {
  link = "";
  loading = false;
  disabled = false;

  async loadSticker() {
    this.loading = true;
    try {
      let fetched = await api.getFilesLink(this.$props.message);
      switch (fetched.status) {
        case "ok":
          this.link = fetched.url;
          window.open(this.link, "_blank");
          break;
        case "tobig":
          this.disabled = true;
          store.setSnackbar({
            message: "errors.media.tobig",
            color: "error",
            active: true
          });
          break;
          defult: store.setSnackbar({
            message: "errors.media.loading",
            color: "error",
            active: true
          });
      }
    } catch {
      store.setSnackbar({
        message: "errors.media.loading",
        color: "error",
        active: true
      });
    } finally {
      this.loading = false;
    }
  }

  filesize(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }

  mobile() {
    if (this.$vuetify.breakpoint.xsOnly) {
      return "center";
    }
    return "start";
  }
}
</script>

<style lang="scss">
.row_nowrap {
  flex-wrap: nowrap !important;
}

.col_nogrow {
  flex-grow: 0 !important;
}

.text_anywherewrap {
  word-wrap: anywhere;
}
</style>