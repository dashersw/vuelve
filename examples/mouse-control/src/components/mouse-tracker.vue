<script setup>
import useMouse from '../composables/use-mouse'

const props = defineProps({
  multiplier: {
    type: Number,
    default: 1,
  },
})

const { x, y, doubleX, doubleY } = useMouse(props)
</script>

<template>
  <p>Mouse position is at: {{ x }}, {{ y }} and doubleX: {{ doubleX }}, doubleY: {{ doubleY }}</p>
</template>
