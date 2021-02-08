<template>
  <div class="new">
    <div class="new-inner">
      <h1 class="new-title">
        追加する
      </h1>
      <InputForm v-model="req_data.name" label-name="商品の名前" />
      <InputForm v-model="req_data.place" label-name="場所(任意)" />
      <AmountForm v-model="req_data.amount" label-name="購入数" @changeAmount="changeAmount" />
      <SelectForm v-model="req_data.user_id" :user-data="user_data" label-name="買ってきてほしい人" />
      <p v-if="is_error" class="error">
        {{ err_msg }}
      </p>
      <div class="new-submit-btn" @click="submit()">
        送信
      </div>
    </div>
  </div>
</template>

<script>
import InputForm from '@/components/ui/InputForm'
import AmountForm from '@/components/ui/AmountForm'
import SelectForm from '@/components/ui/SelectForm'

export default {
  components: {
    InputForm,
    AmountForm,
    SelectForm
  },
  async asyncData ({ app }) {
    const user = await app.$axios.$get('http://localhost:5000/user')
    return { user_data: user }
  },
  data () {
    return {
      req_data: {
        name: '',
        place: '',
        amount: 1,
        user_id: 0
      },
      is_error: false,
      err_msg: ''
    }
  },
  methods: {
    changeAmount (n) {
      this.req_data.amount += n
    },
    async submit () {
      // user_idがStringになっている場合があるので、Numberに変換する
      this.req_data.user_id = Number(this.req_data.user_id)

      // 名前未入力時にエラーメッセージを表示し終了させる
      if (!this.req_data.name) {
        this.is_error = true
        this.err_msg = '名前が未入力です。'
        return
      }

      // user_idが0だった場合はnullに置き換える
      if (this.req_data.user_id === 0) {
        this.req_data.user_id = null
      }

      // APIコール
      await this.$axios.$post('http://localhost:5000/item', this.req_data)

      // トップページにリダイレクト
      this.$router.push('/')
    }
  }
}
</script>

<style>
.new {
  background-color: #edf2f7;
  min-height: calc(100vh - 64px);
}

.new-inner {
  max-width: 900px;
  padding: 30px 5%;
  margin: 0 auto;
}

.new-title {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 32px;
}

.new-submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #329eff;
  color: #fff;
  height: 48px;
  width: 100%;
  border-radius: 8px;
  font-weight: 700;
}

.error {
  color: rgb(224, 55, 97);
  text-align: center;
  margin-bottom: 16px;
}
</style>
