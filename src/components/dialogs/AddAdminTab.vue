<template lang="pug">
v-form(v-model="validid" ref="formAddAdmin" onSubmit="return false;")
  v-card
    v-card-title
      span {{$t('admin.admins')}}
      v-spacer
      v-btn(icon
      :loading='loading'
      @click='refresh')
        v-icon refresh
    v-card-text
      v-container
        div(v-if="adminsinvites && adminsinvites.length >= 1")
          v-data-table(:headers="headersTable" hide-default-footer :items="tableval" class="elevation-1")
            template(v-slot:item.action="{ item }")
              v-icon(@click="removeAdminOrInvite(item)")
                |delete
        div(v-else)
          |{{$t('admin.noadmins')}}
      v-container
        .subtitle-1.black--text {{$t('admin.invite')}}
            v-container(fluid fill-height)
                v-row
                    v-col(cols="7" md="4")
                        v-select.addadmin__select-field(dense :items="[{text: 'E-mail', value: 'E-mail'}, {text: 'TelegramID', value: 'TelegramID'}]" item-value="E-mail" v-model="accountType" :label="$t('admin.type')" 
                        required outlined)
                    v-col(cols="12" md="8")
                        v-text-field.addadmin__text-field(:label='IDFieldText' 
                        :rules="IdentifierRules"
                        @keypress.enter="add"
                        multiline
                        required
                        v-model='accountIdentifier')
    v-card-actions
      v-spacer
      v-btn(text
      @click='add'
      :loading='loading'
      :disabled="!validid"
      color='blue') {{$t('invite')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../utils/api'
import * as store from '../../plugins/store/store'
import { i18n } from '../../plugins/i18n'

interface tabledata {
  id: string
  name: string
  type: string
  status: string
}

@Component({
  props: {
    botId: String,
  },
  watch: {
    botId: async function(val) {
      if (val) {
        ;(this as any).accountType = 'E-mail'
        ;(this as any).accountIdentifier = ''
        ;(this as any).refresh()
      }
    },
    accountType: 'validateForm',
    accountIdentifier: 'validateForm',
    adminsinvites: async function(val) {
      const invited = i18n.t('admin.invited')
      const administrator = i18n.t('admin.admin')
      if (val.length >= 1) {
        let response: any = []
        const maping = await val.map((admin: any) => {
          if (admin.type == 'invite') {
            response.push({
              name: (admin as any).name,
              type: 'invite',
              status: invited,
              id: (admin as any).id,
            })
          } else {
            response.push({
              name: (admin as any).name,
              type: 'admin',
              status: administrator,
              id: (admin as any).id,
            })
          }
        })
        await Promise.all(maping)
        ;(this as any).tableValues = response
        return
      }
      ;(this as any).tableValues = []
    },
  },
})
export default class AddAdminTab extends Vue {
  $refs!: Vue['$refs'] & {
    formAddAdmin: any
  }

  loading = false
  accountIdentifier = ''
  accountType = ''
  adminsinvites: api.InvitesAdminsArray[] = []
  validid = false
  tableValues: tabledata[] = []

  get headersTable() {
    const status = i18n.t('admin.status')
    const name = i18n.t('admin.name')
    const actions = i18n.t('admin.actions')
    return [
      { text: name, value: 'name' },
      { text: status, value: 'status' },
      { text: actions, value: 'action', sortable: false },
    ]
  }

  mounted() {
    this.accountType = 'E-mail'
    this.accountIdentifier = ''
    this.refresh()
  }

  get tableval() {
    return this.tableValues
  }

  async removeAdminOrInvite(item: tabledata) {
    if (!confirm(i18n.t('admin.confirm', { name: item.name }) as string)) {
      return
    }
    this.loading = true
    try {
      await api.RejectAdmin(item.id, this.$props.botId, item.type)
      this.refresh()
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.loading = false
    }
  }

  async add() {
    this.loading = true
    try {
      if (!this.validid) {
        return
      }
      const response = await api.BotInviteAdmin(
        this.$props.botId,
        this.accountIdentifier,
        this.accountType,
      )
      store.setBots(await api.getBots())
    } catch (err) {
      if (err && err.response && err.response.data) {
        store.setSnackbarError(err.response.data)
      } else {
        store.setSnackbarError('errors.bot.inviteAdmin')
      }
    } finally {
      this.refresh()
      this.loading = false
    }
  }

  async refresh() {
    this.loading = true
    try {
      this.adminsinvites = await api.GetInvitesAndAdministrators(
        this.$props.botId,
      )
    } catch (err) {
      if (err && err.response && err.response.data) {
        store.setSnackbarError(err.response.data)
      } else {
        store.setSnackbarError('errors.bot.getAdmins')
      }
    } finally {
      this.$refs.formAddAdmin.resetValidation()
      this.loading = false
    }
  }

  get IDFieldText() {
    if (this.accountType == 'E-mail') {
      return 'E-mail'
    }
    return 'TelegramID'
  }

  validateForm() {
    setTimeout(this.revalidateForm, 100)
  }

  revalidateForm() {
    if (!this.$refs.formAddAdmin) {
      return
    }
    this.$refs.formAddAdmin.validate()
  }

  get IdentifierRules() {
    const rules = [
      (v: any) => !!v || i18n.t('validation.needtext'),
      (v: any) =>
        (v && v.length < 200) || i18n.t('validation.greetings.toomanychars'),
    ]
    if (this.accountType == 'E-mail') {
      const rule = (v: any) =>
        (v && /.+@.+/.test(v)) || i18n.t('validation.notemail')
      rules.push(rule)
    } else {
      const rule = (v: any) =>
        (v && !isNaN(v)) || i18n.t('validation.notnumber')
      rules.push(rule)
    }
    return rules
  }
}
</script>

<style>
.addadmin__text-field {
  margin-top: 0px !important;
  padding-top: 0px !important;
}

.addadmin__select-field {
  height: 40px !important;
}
</style>