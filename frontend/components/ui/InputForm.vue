<template>
  <div class="form-area">
    <p class="form-label">
      {{ labelName }}
    </p>
    <input type="text" class="form-input" :value="value" @input="updateValue">
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
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.value)
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

.form-input {
  box-sizing: border-box;
  width: 100%;
  padding: 1rem 0.5rem;
  border: 0;
  border-radius: 4px;
}
</style>
