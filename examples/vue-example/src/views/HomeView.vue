<script setup lang="ts">
import UsersList from '@/components/UsersList.vue'
import PostsList from '@/components/PostsList.vue'
import { ref } from 'vue'

type TabValue = 'posts' | 'users'

const currentTab = ref<TabValue>('posts')
</script>

<template>
  <main class="container">
    <label>
      <input v-model="currentTab" type="radio" name="tabType" value="posts" />
      Posts
    </label>
    <label>
      <input v-model="currentTab" type="radio" name="tabType" value="users" />
      Users
    </label>
    <PostsList v-if="currentTab === 'posts'" />
    <UsersList v-if="currentTab === 'users'" />
  </main>
</template>
<style scoped>
.container {
  width: 100%;
}
</style>
