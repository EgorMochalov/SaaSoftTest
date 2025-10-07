<template>
  <div id="app" class="app">
    <div class="app__container">
      <AccountTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountTable from './components/AccountTable.vue';
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
}

.app__container {
  max-width: 100%;
  margin: 0 auto;
}

* {
  box-sizing: border-box;
}
</style>