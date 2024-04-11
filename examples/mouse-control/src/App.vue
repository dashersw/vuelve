<script setup>
import MouseTracker from './components/mouse-tracker.vue'
import MouseTrackerVuelve from './components/mouse-tracker-vuelve.vue'

import { ref } from 'vue'

const count = ref(1)

setInterval(() => {
  count.value++
}, 3000)

function reset() {
  count.value = 1
}
</script>

<template>
  <main>
    <p>Multiplier: {{ count }}</p>
    <MouseTracker :multiplier="count" />
    <MouseTrackerVuelve :multiplier="count" />
    <button @click="reset">Reset</button>
  </main>
</template>
