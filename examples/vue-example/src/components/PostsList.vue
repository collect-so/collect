<script setup lang="ts">
import { useCollect } from '@/composables/api/useCollect'
import { ref } from 'vue'
import type { CollectSDKResult } from '@collect.so/javascript-sdk'
// import type { Post } from '@/models/post/post.interface'
// import {CollectQuery} from "@collect.so/javascript-sdk";

const { post, collect } = useCollect()
const postList = ref<CollectSDKResult<typeof post.find>>()

async function getPosts() {
  // @TODO: why should I use collect.records and how to assign potential type?
  // maybe I should just Post repo
  // @TODO: how to GET all posts or users without any where coniditions?
  postList.value = await collect.records.find<typeof post.schema>({
    where: {
      title: ''
    },
    labels: ['post']
  })

  // // we can build it without generic argument in find and use generic arg in CollectQuery
  // const postsQuery: CollectQuery<typeof post.schema> = {
  //   where: {
  //     title: '',
  //     content: ''
  //   }
  // }
  // postList.value = await collect.records.find(postsQuery)
  //
  // // or we can use our Post interface
  // const postsQuery: CollectQuery<Post> = {
  //   where: {
  //     title: '',
  //     content: ''
  //   }
  // }
  // postList.value = await collect.records.find(postsQuery)
}

getPosts()
</script>

<template>
  <ul class="posts">
    <li v-for="{ __id, title, content } in postList?.data" :key="__id">
      <h3>
        {{ title }}
      </h3>
      <p>
        {{ content }}
      </p>
    </li>
  </ul>
</template>

<style scoped>
h3 {
  font-size: 1.2rem;
}

.posts {
  text-align: left;
  width: 100%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
</style>
