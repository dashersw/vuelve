<script setup>
import mouseVuelve from '@/composables/mouse-vuelve'

const props = defineProps({
  multiplier: {
    type: Number,
    default: 1,
  },
})

const { x, y, doubleX, doubleY } = mouseVuelve(props)
</script>

<template>
  <p>Mouse position is at: {{ x }}, {{ y }} and doubleX: {{ doubleX }}, doubleY: {{ doubleY }}</p>
</template>
