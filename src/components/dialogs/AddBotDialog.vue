<template lang="pug">
  v-dialog(v-model='dialog'
  scrollable
  max-width='600px'
  persistent)
    v-form(v-model="validtoken" ref="formAddBot" onSubmit="return false;")
      v-card
        v-card-title {{$t('addBot.title')}}
        v-card-text
          v-container(fluid fill-height)
            v-row
                v-col(cols="7" md="4")
                  v-select.addbot__select-field(dense :items="[{text: 'Telegram', value: 'Telegram'}, {text: 'Viber', value: 'Viber'}]" item-value="Telegram" v-model="botType" :label="$t('bot.type')" 
                  required outlined)
                v-col(cols="12" md="8")
                  v-text-field.addbot__text-field(:label='$t("addBot.token")' 
                  :rules="tokenRules"
                  single-line
                  v-model='token')
    
        v-card-actions
          v-spacer
          v-btn(text 
          @click='close'
          :loading='loading'
          color='error') {{$t('cancel')}}
          v-btn(text
          @click='save'
          :loading='loading'
          :disabled="!validtoken"
          color='blue') {{$t('save')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../utils/api'
import * as store from '../../plugins/store/store'
import { i18n } from '../../plugins/i18n'

@Component({
  props: {
    dialog: Boolean,
    close: Function,
  },
  watch: {
    botType: 'validateForm',
    token: 'validateForm',
    dialog: async function(val) {
      console.log(val)
      if (val) {
        ;(this as any).botType = 'Telegram'
        ;(this as any).token = ''
        setTimeout((this as any).reset, 101)
      }
    },
  },
})
export default class AddBotDialog extends Vue {
  $refs!: Vue['$refs'] & {
    formAddBot: any
  }

  loading = false
  token = ''
  validtoken = false
  botType = ''

  async save() {
    this.loading = true
    try {
      await api.postBot(this.token, this.botType)
      store.setBots(await api.getBots())
      ;(this as any).close()
    } catch (err) {
      if (err && err.response && err.response.data) {
        store.setSnackbarError(err.response.data)
      } else {
        store.setSnackbarError('errors.bot.add')
      }
    } finally {
      this.loading = false
    }
  }

  reset() {
    this.$refs.formAddBot.resetValidation()
  }

  validateForm() {
    setTimeout(this.revalidateForm, 100)
  }

  revalidateForm() {
    if (!this.$refs.formAddBot) {
      return
    }
    this.$refs.formAddBot.validate()
  }

  get tokenRules() {
    if (this.botType === 'Telegram') {
      const regex = new RegExp(/[0-9]+:[a-zA-Z0-9_-]+/)
      return [
        (v: any) => !!v || i18n.t('validation.needtext'),
        (v: any) => regex.test(v) || i18n.t('validation.tokenformat'),
      ]
    }
    const regex = new RegExp(/[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+/)
    return [
      (v: any) => !!v || i18n.t('validation.needtext'),
      (v: any) => regex.test(v) || i18n.t('validation.vibertokenformat'),
    ]
  }
}
</script>

<style>
.addbot__text-field {
  margin-top: 0px !important;
  padding-top: 0px !important;
}

.addbot__select-field {
  height: 40px !important;
}
</style>