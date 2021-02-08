<template>
  <div class="new">
    <div class="new-inner">
      <h1 class="new-title">
        追加する
      </h1>
      <div class="form-area">
        <p class="form-label">
          商品の名前
        </p>
        <input v-model="req_data.name" type="text" class="form-input">
      </div>
      <div class="form-area">
        <p class="form-label">
          場所(任意)
        </p>
        <input v-model="req_data.place" type="text" class="form-input">
      </div>
      <div class="form-area">
        <p class="form-label">
          購入数
        </p>
        <div class="form-amount-area">
          <button class="amount-btn" :disabled="is_minus_btn_disabled" @click="changeAmount(-1)">
            -
          </button>
          <input v-model="req_data.amount" type="text" class="form-amount">
          <button class="amount-btn" @click="changeAmount(1)">
            +
          </button>
        </div>
      </div>
      <div class="form-area">
        <p class="form-label">
          買ってきてほしい人
        </p>
        <select v-model="req_data.user_id" class="form-user-select">
          <option value="0">
            誰でも良い
          </option>
          <option v-for="(user, index) in user_data" :key="index" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <div class="new-submit-btn" @click="submit()">
        送信
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      }
    }
  },
  computed: {
    is_minus_btn_disabled () {
      return this.req_data.amount === 1
    }
  },
  methods: {
    changeAmount (n) {
      this.req_data.amount += n
    },
    async submit () {
      if (this.req_data.user_id === '0' || this.req_data.user_id === 0) {
        this.req_data.user_id = null
      }
      await this.$axios.$post('http://localhost:5000/item', this.req_data)
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

.form-label {
  margin: 8px 0;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  padding: 1rem 0.5rem;
  border: 0;
  margin-bottom: 16px;
  border-radius: 4px;
}

.form-user-select {
  width: 100%;
  font-size: 1rem;
  padding: 1rem 0.5rem;
  border: 0;
  border-radius: 4px;
  margin-bottom: 32px;
}

.form-amount-area {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.amount-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #329eff;
  color: #fff;
  height: 48px;
  width: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  border: 0;
}

.amount-btn:disabled {
  background: #AAA;
}

.form-amount {
  width: calc(100% - 200px);
  height: 48px;
  border: 0;
  border-radius: 12px;
  text-align: center;
  font-size: 1.5rem;
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
</style>
