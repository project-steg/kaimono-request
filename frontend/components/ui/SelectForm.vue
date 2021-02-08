<template>
  <div class="form-area">
    <p class="form-label">
      {{ labelName }}
    </p>
    <select :value="value" class="form-user-select" @input="updateValue">
      <option value="0">
        誰でも良い
      </option>
      <option v-for="(user, index) in userData" :key="index" :value="user.id">
        {{ user.name }}
      </option>
    </select>
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
      type: Number,
      required: true
    },
    userData: {
      type: Array,
      required: true
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

.form-user-select {
  width: 100%;
  font-size: 1rem;
  padding: 1rem 0.5rem;
  border: 0;
  border-radius: 4px;
  margin-bottom: 32px;
}
</style>
