<script setup lang="ts">
import { useCollect } from '@/composables/api/useCollect'
import { ref } from 'vue'
import type { CollectSDKResult } from '@collect.so/javascript-sdk'

const { user } = useCollect()
const userList = ref<CollectSDKResult<typeof user.find>>()

const username = ref<string>()
const dob = ref<string>()
const married = ref<boolean>()
const age = ref<number>()

async function handleClickUserCreation(event: Event) {
  event.preventDefault()
  if (!username.value || !age.value || !married.value || !dob.value) {
    return
  }

  // @TODO: which type i should use to create contract between user repo and payload. Can I get it from collect?
  const payload = {
    username: username.value,
    id: Math.floor(Math.random() * 10000),
    age: age.value,
    married: married.value,
    dob: dob.value
  }

  await user.create(payload)
}

async function handleGetUserList() {
  userList.value = await user.find({
    where: {
      username: {
        $startsWith: ''
      }
    },
    limit: 1000,
    orderBy: 'desc',
    skip: 0
  })
}
</script>

<template>
  <section class="container">
    <div>
      <form class="form">
        <label class="form-label">
          Username
          <input v-model="username" type="text" name="username" required />
        </label>
        <label class="form-label">
          Date of birth
          <input v-model="dob" type="date" name="dob" required />
        </label>
        <label class="form-label">
          Age
          <input v-model.number="age" type="number" name="age" required />
        </label>
        <label class="form-checkbox">
          <input v-model="married" type="checkbox" required />
          Married
        </label>
      </form>
      <button class="form-button" type="submit" @click="handleClickUserCreation">
        Create user
      </button>
      <button class="form-button" type="button" @click="handleGetUserList">Get user list</button>
    </div>
    <ul class="form-result">
      <li v-for="{ __id, __label, __proptypes, ...user } in userList?.data" :key="__id">
        <ul>
          <li v-for="[key, value] in Object.entries(user)" :key="key">
            {{ key }}: <span> {{ JSON.stringify(value) }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.form-result {
  max-width: 800px;
  min-width: 400px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.form {
  gap: 12px;
}

.form-label,
.form-checkbox {
  gap: 6px;
}

.form-checkbox {
  flex-direction: row;
}

.form,
.form-label {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
