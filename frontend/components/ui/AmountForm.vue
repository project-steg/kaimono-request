<template>
  <div class="form-area">
    <p class="form-label">
      {{ labelName }}
    </p>
    <div class="form-amount-area">
      <button class="amount-btn" :disabled="is_minus_btn_disabled" @click="$emit('changeAmount', -1)">
        -
      </button>
      <input :value="value" type="text" class="form-amount" @input="updateValue">
      <button class="amount-btn" @click="$emit('changeAmount', 1)">
        +
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labelName: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    }
  },
  computed: {
    is_minus_btn_disabled () {
      return this.value === 1
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('input', Number(e.target.value))
    }
  }
}
</script>

<style>
.form-area {
  margin-bottom: 16px;
}

.form-label {
  margin: 8px 0;
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
</style>
