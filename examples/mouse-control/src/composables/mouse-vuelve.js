import vuelve from '../../../../src/index'

export default vuelve({
  data: { x: 0, y: 0 },
  props: ['props'],
  methods: {
    update(event) {
      this.x.value = event.pageX * this.props.multiplier
      this.y.value = event.pageY * this.props.multiplier
    },
  },
  watch: {
    x(newX) {
      console.log('watch x', newX)
    },
  },
  computed: {
    doubleX() {
      return this.x.value * 2
    },
    doubleY() {
      return this.y.value * 2
    },
  },
  watchEffect: {
    update() {
      console.log('watch effect', this.x.value, this.y.value)
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  },
})
