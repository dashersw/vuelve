import { ref, defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import vuelve from '../src'

describe('vuelve', () => {
  it('implements computed, mounted, watch, watchEffect', async () => {
    function composable() {
      const val = ref(0)

      return { val }
    }

    const watchedValue = ref(0)
    const watchEffectValue = ref(0)
    const mountedValue = ref(0)

    function computedVal() {
      return this.val.value + 1
    }

    function mountedFn() {
      this.mountedValue.value = this.val.value + 6
    }

    function watchFn() {
      this.watchedValue.value = this.val.value + 2
    }

    function watchEffectFn() {
      this.watchEffectValue.value = this.val.value + 4
    }

    const vComposable = {
      props: ['val'],
      computed: { computedVal },
      watch: { val: watchFn },
      mounted: mountedFn,
      watchEffect: { watchEffectFn },
      returns: { computedVal, watchedValue, watchEffectValue, watchFn, watchEffectFn, mountedFn, mountedValue },
    }

    const component = defineComponent({
      name: 'Test',
      template: `
        <div id="rvComputed">{{rvComputed}}</div>
        <div id="rvWatched">{{rvWatched}}</div>
        <div id="rvWatchEffect">{{rvWatchEffect}}</div>
        <div id="rvMounted">{{rvMounted}}</div>
        `,
      setup() {
        const { val } = composable()

        const {
          computedVal: rvComputed,
          watchedValue: rvWatched,
          watchEffectValue: rvWatchEffect,
          mountedValue: rvMounted,
        } = vuelve(vComposable)(val)

        val.value += 1

        return {
          rvComputed,
          rvWatched,
          rvWatchEffect,
          rvMounted,
        }
      },
    })

    const wrapper = mount(component)
    await nextTick()

    expect(wrapper.find('#rvComputed').text()).toBe('2')
    expect(wrapper.find('#rvWatched').text()).toBe('3')
    expect(wrapper.find('#rvWatchEffect').text()).toBe('5')
    expect(wrapper.find('#rvMounted').text()).toBe('7')
  })

  it('implements module pattern', () => {
    const val = ref('hello')

    const composable = {
      default: {},
      val,
    }

    const { val: rv } = vuelve(composable)()

    expect(rv.value).toBe('hello')
  })
})
