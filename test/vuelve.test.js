import { ref, defineComponent, nextTick, onErrorCaptured } from 'vue'
import { mount, renderToString } from '@vue/test-utils'
import vuelve from '../src'

describe('vuelve', () => {
  it('implements computed, mounted, beforeUpdate, updated, beforeUnmount, unmounted, renderTriggered, renderTracked, watch, watchEffect', async () => {
    function composable() {
      const val = ref(0)

      return { val }
    }

    const watchedValue = ref(0)
    const watchEffectValue = ref(0)
    const mountedValue = ref(0)
    const updatedValue = ref(0)
    const beforeUpdateValue = ref(0)

    const lifecycleHookCallbacks = {
      mountedFn: function () {
        this.mountedValue.value = this.val.value + 6
      },
      updatedFn: function () {
        this.updatedValue.value = this.val.value + 20
      },
      beforeUpdateFn: function () {
        this.beforeUpdateValue.value = this.val.value + 30
      },
      beforeUnmountFn: function () {},
      unmountedFn: function () {},
      renderTriggeredFn: function () {},
      renderTrackedFn: function () {},
    }

    function computedVal() {
      return this.val.value + 1
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
      mounted: lifecycleHookCallbacks.mountedFn,
      updated: lifecycleHookCallbacks.updatedFn,
      beforeUpdate: lifecycleHookCallbacks.beforeUpdateFn,
      beforeUnmount: lifecycleHookCallbacks.beforeUnmountFn,
      unmounted: lifecycleHookCallbacks.unmountedFn,
      renderTracked: lifecycleHookCallbacks.renderTrackedFn,
      renderTriggered: lifecycleHookCallbacks.renderTriggeredFn,
      watchEffect: { watchEffectFn },
      returns: {
        ...lifecycleHookCallbacks,
        computedVal,
        watchedValue,
        watchEffectValue,
        watchFn,
        watchEffectFn,
        mountedValue,
        updatedValue,
        beforeUpdateValue,
      },
    }

    const beforeUnmountSpy = jest.spyOn(vComposable.returns, 'beforeUnmountFn')
    const unmountedSpy = jest.spyOn(vComposable.returns, 'unmountedFn')
    const renderTriggeredSpy = jest.spyOn(vComposable.returns, 'renderTriggeredFn')
    const renderTrackedSpy = jest.spyOn(vComposable.returns, 'renderTrackedFn')

    const component = defineComponent({
      name: 'Test',
      template: `
        <div id="rvComputed">{{rvComputed}}</div>
        <div id="rvWatched">{{rvWatched}}</div>
        <div id="rvWatchEffect">{{rvWatchEffect}}</div>
        <div id="rvMounted">{{rvMounted}}</div>
        <div id="rvUpdated">{{rvUpdated}}</div>
        <div id="rvBeforeUpdate">{{rvBeforeUpdate}}</div>
        `,
      setup() {
        const { val } = composable()

        const {
          computedVal: rvComputed,
          watchedValue: rvWatched,
          watchEffectValue: rvWatchEffect,
          mountedValue: rvMounted,
          updatedValue: rvUpdated,
          beforeUpdateValue: rvBeforeUpdate,
        } = vuelve(vComposable)(val)

        val.value += 1

        return {
          rvComputed,
          rvWatched,
          rvWatchEffect,
          rvMounted,
          rvUpdated,
          rvBeforeUpdate,
        }
      },
    })

    const wrapper = mount(component)
    await nextTick()
    expect(wrapper.find('#rvComputed').text()).toBe('2')
    expect(wrapper.find('#rvWatched').text()).toBe('3')
    expect(wrapper.find('#rvWatchEffect').text()).toBe('5')
    expect(wrapper.find('#rvMounted').text()).toBe('7')
    expect(wrapper.find('#rvUpdated').text()).toBe('21')
    expect(wrapper.find('#rvBeforeUpdate').text()).toBe('31')
    wrapper.unmount()
    expect(beforeUnmountSpy).toHaveBeenCalled()
    expect(unmountedSpy).toHaveBeenCalled()
    expect(renderTriggeredSpy).toHaveBeenCalled()
    expect(renderTrackedSpy).toHaveBeenCalled()
  })

  it('implements activated, deactivated', async () => {
    const lifecycleHookCallbacks = {
      activatedFn: function () {},
      deactivatedFn: function () {},
    }

    const vComposable = {
      activated: lifecycleHookCallbacks.activatedFn,
      deactivated: lifecycleHookCallbacks.deactivatedFn,
      returns: {
        ...lifecycleHookCallbacks,
      },
    }

    const activatedSpy = jest.spyOn(vComposable.returns, 'activatedFn')
    const deactivatedSpy = jest.spyOn(vComposable.returns, 'deactivatedFn')

    const ChildComponent = defineComponent({
      name: 'ChildComponent',
      template: `
        <p>
          Child Component
        </p>  
      `,
      setup() {
        vuelve(vComposable)()
      },
    })

    const parentComponent = defineComponent({
      name: 'ParentComponent',
      template: `
        <KeepAlive>
          <child-component />
        </KeepAlive>
      `,
      components: {
        ChildComponent,
      },
    })

    const wrapper = mount(parentComponent)
    await nextTick()

    expect(activatedSpy).toHaveBeenCalled()
    wrapper.unmount()
    expect(deactivatedSpy).toHaveBeenCalled()
  })
  /*
  it('captures errors using onErrorCaptured', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    const wrapper = mount(ErrorThrower)

    await wrapper.find('button').trigger('click')

    expect(consoleSpy).toHaveBeenCalledWith('Error captured:', 'Test error')
    consoleSpy.mockRestore() // Clean up the spy to avoid side effects
  })*/
  /*
  it('should catch errors and logs and send them to snackbar', async () => {
    // Mock the snackbar or logging function
    const logError = jest.fn()
    // Assume `useSnackbar` is a function that returns an object with a `logError` method
    // This could be a Vue composable, a Vuex action, etc.
    const vComposable = {
      errorCaptured: logError,
      returns: {}
    }
    vComposable.returns.errorCapturedFn = logError

    // Setup the component, which should throw an error during setup
    const errorComponent = defineComponent({
      setup() {
        onErrorCaptured(vComposable.returns.errorCapturedFn)
        throw new Error('error message')
      },
    })

    // Mount the component - this should trigger the error and the error handling
    mount(errorComponent)

    // Assert that the error was logged or sent to the snackbar
    expect(logError).toHaveBeenCalledWith(expect.any(Error))
  })*/

  it('implements erverPrefetch', async () => {
    function composable() {
      const val = ref(0)

      return { val }
    }

    function fakeFetch(text) {
      return Promise.resolve(text)
    }

    const lifecycleHookCallbacks = {
      serverPrefetchFn: async function () {
        this.val.value = await fakeFetch('onServerPrefetch')
      },
    }

    const vComposable = {
      props: ['val'],
      serverPrefetch: lifecycleHookCallbacks.serverPrefetchFn,
      returns: {
        ...lifecycleHookCallbacks,
      },
    }

    const Component = defineComponent({
      template: '<div>{{ val }}</div>',
      setup() {
        const { val } = composable()
        vuelve(vComposable)(val)
        return { val }
      },
    })

    const contents = await renderToString(Component)
    expect(contents).toBe('<div>onServerPrefetch</div>')
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
