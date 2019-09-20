<template lang="pug">
  v-card(flat)
    v-navigation-drawer(permanent)
      div(v-for='i in 10' :key='i')
        v-list-item
          v-list-item-content
            v-list-item-title Noice
            v-list-item-subtitle More noice things
        v-divider
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AddBotDialog from "./AddBotDialog.vue";
import * as api from "../utils/api";
import { Bot } from "../models/bot";
import * as store from "../plugins/store";
import { i18n } from "../plugins/i18n";

@Component({
  props: {
    bot: Object
  }
})
export default class NoBots extends Vue {}
</script>
