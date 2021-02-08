<template>
  <div class="item" @click="editItem()">
    <div class="item-description">
      <p class="item-name">
        {{ itemData.name }}
      </p>
      <div class="item-option">
        <div v-if="itemData.place" class="item-place">
          {{ itemData.place }}
        </div>
        <p v-if="itemData.user" class="item-user">
          購入者: {{ itemData.user.name }}
        </p>
      </div>
    </div>
    <div class="item-amount">
      {{ itemData.amount }}<span>個</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemData: { type: Object, required: true }
  },
  methods: {
    editItem () {
      return this.$router.push(`/edit/${this.itemData.id}`)
    }
  }
}
</script>

<style>
.item {
  height: 120px;
  background-color: #fff;
  border-radius: 13px;
  box-shadow: 0px 30px 45px -15px rgb(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 16px;
}

.item-place {
  color: #329eff;
  border: solid 1px #329eff;
  padding: 2px 4px;
  font-size: 0.5rem;
  border-radius: 3px;
  margin-right: 8px;
}

.item-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.item-option {
  display: flex;
  justify-content: left;
  align-content: center;
  box-sizing: border-box;
}

.item-user {
  display: flex;
  color: #999;
  font-size: 0.8rem;
}

.item-amount {
  font-size: 2.5rem;
  font-weight: 700;
}

.item-amount > span {
  font-size: 0.8rem;
}
</style>
