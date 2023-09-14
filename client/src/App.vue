<script setup lang="ts">
import { socketState, manage } from '@/libs/';
import { getUserById } from '@/libs/api'
import { onMounted } from 'vue';

onMounted(async() => {
  const random = Math.floor(Math.random() * 10)+1;
  const user = await getUserById(random);
  manage(user);
});

</script>

<template>
  <main class="mx-auto w-3/4">
    <header>
      <h1 class="mb-2 mt-0 text-6xl font-medium leading-tight text-primary">Socket.io</h1>
    </header>
    <div>
      {{ socketState }}
    </div>
  </main>
</template>

<style scoped>
</style>
