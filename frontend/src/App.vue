<script lang="ts">
  import Layout from './layouts/Layout.vue'
  
  export default {
    components: {
      Layout,
    },
  }
  
</script>

<template>
  <Transition name="fade-300" appear>
    <Layout />
  </Transition>
</template>

<style>
  .fade-300-enter-active,
  .fade-300-leave-active {
    transition: opacity 300ms ease;
  }
  
  .fade-300-enter-from,
  .fade-300-leave-to {
    opacity: 0;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 150ms ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .rows-enter-active,
  .rows-leave-active {
    transition: all 300ms ease;
  }
  .rows-enter-from,
  .rows-leave-to {
    opacity: 0;
  }
</style>