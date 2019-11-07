<template lang="pug">
v-list-item-title.message-text 
    v-container(fluid)
        v-row(dense :justify="mobile()")
            v-col(md="auto").col_nogrow
                v-btn(fab outlined small color="indigo" :loading="loading" :disabled="disabled" @click="false") 
                    v-icon mdi-account
            v-col(md="auto")
                #contact-number(class="caption") {{message.raw.contact.phone_number}}
                div(class="caption") {{name(message.raw.contact)}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../../../utils/api";
import * as store from "../../../plugins/store/store";

@Component({
  props: ["message"]
})
export default class TelegramContactMessage extends Vue {
  link = "";
  loading = false;
  disabled = false;

  name(contact: any) {
    let name = contact.first_name;
    name = contact.last_name ? `${name} ${contact.last_name}` : name;
    return name;
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