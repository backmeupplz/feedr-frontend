<template lang="pug">
.headline.pa-4.text-center {{ $t("noBots") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AddBotDialog from './AddBotDialog.vue'
import * as api from '../utils/api'
import { Bot } from '../models/bot'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'

@Component
export default class NoBots extends Vue {}
</script>
