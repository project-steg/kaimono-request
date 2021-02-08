<template>
  <header>
    <div class="header-inner">
      <div class="header-logo" @click="$router.push('/')">
        <Logo />
      </div>
      <div class="header-btn" @click="$router.push('/new')">
        追加する
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/components/svg/Logo'
export default {
  components: {
    Logo
  }
}
</script>

<style scoped>
header {
  height: 64px;
  background-color: #FFFFFF;
}

.header-inner {
  height: 100%;
  max-width: 900px;
  padding: 0 30px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  width: 140px;
}

.header-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #329eff;
  color: #fff;
  letter-spacing: 0.5px;
  height: 35px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 8px;
}
</style>
