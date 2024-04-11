import { ref, onMounted, onUnmounted, watchEffect, computed, watch } from 'vue'

export default function useMouse(props) {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX * props.multiplier
    y.value = event.pageY * props.multiplier
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  const doubleX = computed(() => x.value * 2)
  const doubleY = computed(() => y.value * 2)

  watch(x, newX => {
    console.log('watch x', newX)
  })

  watchEffect(() => {
    console.log('watch effect', x.value, y.value)
  })

  return { x, y, doubleX, doubleY }
}
