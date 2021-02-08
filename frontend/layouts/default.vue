<template>
  <div>
    <Header />
    <Nuxt />
  </div>
</template>

<script>
import Header from '@/components/layout/Header'
export default {
  components: {
    Header
  }
}
</script>

<style>
html {
  font-family: 'Rubik', 'Noto Sans JP', sans-serif;
  color: #333;
  line-height: 1.7;
}
</style>
