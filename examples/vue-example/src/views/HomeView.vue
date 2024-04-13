<script setup lang="ts">
import UsersList from '@/components/UsersList.vue'
import PostsList from '@/components/PostsList.vue'
</script>

<template>
  <main class="container">
    <UsersList />
    <PostsList />
  </main>
</template>
<style scoped>
.container {
  width: 100%;
}
</style>
