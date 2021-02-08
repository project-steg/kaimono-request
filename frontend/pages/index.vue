<template>
  <div class="index">
    <div class="index-inner">
      <Item v-for="(item, index) in item_data" :key="index" :item-data="item" />
    </div>
  </div>
</template>

<script>
import Item from '@/components/layout/Item'
export default {
  components: {
    Item
  },
  async asyncData ({ app }) {
    const data = await app.$axios.$get('http://localhost:5000/item')
    const user = await app.$axios.$get('http://localhost:5000/user')
    return {
      item_data: data,
      user_data: user
    }
  }
}
</script>

<style>
.index {
  background-color: #edf2f7;
  min-height: calc(100vh - 64px);
}

.index-inner {
  max-width: 900px;
  padding: 30px 5%;
  margin: 0 auto;
}
</style>
