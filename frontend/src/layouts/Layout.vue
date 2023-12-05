<script lang="ts">
  import Events from './Events.vue'
  
  export default {
    components: {
      Events
    },
    
    // end
  }
</script>

<template>
  <div class="bg-gray-300 w-full p-5">
    <div class="bg-white border border-gray-300 shadow-lg rounded-lg p-4 min-h-[calc(100vh-2.5rem)]">
      <Events />
    </div>
  </div>
</template>