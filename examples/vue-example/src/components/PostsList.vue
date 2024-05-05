<script setup lang="ts">
import { useCollect } from '@/composables/api/useCollect'
import { ref } from 'vue'
import type { CollectSDKResult } from '@collect.so/javascript-sdk'
import type { CollectRecordInstance } from '@collect.so/javascript-sdk/types/sdk/instance'
import { postModel } from '@/models'
// import type { Post } from '@/models/post/post.interface'
// import {CollectQuery} from "@collect.so/javascript-sdk";

const { post, collect } = useCollect()
const postList = ref<CollectSDKResult<typeof post.find>>()

const postTitle = ref<string>()
const postContent = ref<string>()
const relatedUser = ref<string>()

async function getPosts() {
  // @TODO: why should I use collect.records and how to assign potential type?
  // maybe I should just Post repo
  // @TODO: how to GET all posts or users without any where coniditions?
  postList.value = await collect.records.find<typeof post.schema>({
    where: {
      title: {
        $not: ''
      }
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
  console.log(postList.value)
}

async function handleCreatePost() {
  if (!postTitle.value || !postContent.value) {
    return
  }

  const createdPost = (await post.create({
    title: postTitle.value,
    content: postContent.value
  })) satisfies CollectRecordInstance<typeof postModel.schema>

  if (relatedUser.value) {
    await createdPost.attach(relatedUser.value)
  }

  getPosts()
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

  <section>
    <form class="form">
      <label class="form-label">
        Post title
        <input v-model="postTitle" type="text" placeholder="Enter post title here" />
      </label>
      <label class="form-label">
        Post content
        <textarea v-model="postContent" />
      </label>
      <label class="form-label">
        User __id
        <input v-model="relatedUser" type="text" placeholder="User id here" />
      </label>
      <button class="form-button" type="submit" @click.prevent="handleCreatePost">
        Create post
      </button>
    </form>
  </section>
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
  margin: 20px 0;
  padding: 0;
}

.form-label,
.form,
.form-label {
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
