/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, defineComponent, nextTick } from 'vue'
import { mount, renderToString } from '@vue/test-utils'
import vuelve, { Composable } from '../src/index.ts'

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
      mountedFn(this: any): void {
        this.mountedValue.value = this.val.value + 6
      },
      updatedFn(this: any): void {
        this.updatedValue.value = this.val.value + 20
      },
      beforeUpdateFn(this: any): void {
        this.beforeUpdateValue.value = this.val.value + 30
      },
      beforeUnmountFn() {},
      unmountedFn() {},
      renderTriggeredFn() {},
      renderTrackedFn() {},
    }

    function computedVal(this: any) {
      return this.val.value + 1
    }

    function watchFn(this: any) {
      this.watchedValue.value = this.val.value + 2
    }

    function watchEffectFn(this: any) {
      this.watchEffectValue.value = this.val.value + 4
    }

    const vComposable: Composable & {
      returns: {
        computedVal: typeof computedVal
        watchedValue: typeof watchedValue
        watchEffectValue: typeof watchEffectValue
        watchFn: typeof watchFn
        watchEffectFn: typeof watchEffectFn
        mountedValue: typeof mountedValue
        updatedValue: typeof updatedValue
        beforeUpdateValue: typeof beforeUpdateValue
      }
    } = {
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

    const beforeUnmountSpy = jest.spyOn(vComposable.returns as object, 'beforeUnmountFn' as never)
    const unmountedSpy = jest.spyOn(vComposable.returns as object, 'unmountedFn' as never)
    const renderTriggeredSpy = jest.spyOn(vComposable.returns as object, 'renderTriggeredFn' as never)
    const renderTrackedSpy = jest.spyOn(vComposable.returns as object, 'renderTrackedFn' as never)

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

  it('check unexpected conditions for lifecycle hooks like not assigned function in returns', async () => {
    function composable() {
      const val = ref(0)

      return { val }
    }

    const mountedFn = jest.fn()

    const vComposable: Composable = {
      props: ['val'],
      mounted: mountedFn,
      returns: {},
    }

    const component = defineComponent({
      name: 'Test',
      template: `
        <div></div>
        `,
      setup() {
        const { val } = composable()

        vuelve(vComposable)(val)

        return { val }
      },
    })

    mount(component)
    await nextTick()
    expect(mountedFn).not.toHaveBeenCalled()
  })

  it('implements activated, deactivated', async () => {
    const lifecycleHookCallbacks = {
      activatedFn() {},
      deactivatedFn() {},
    }

    const vComposable: Composable = {
      activated: lifecycleHookCallbacks.activatedFn,
      deactivated: lifecycleHookCallbacks.deactivatedFn,
      returns: {
        ...lifecycleHookCallbacks,
      },
    }

    const activatedSpy = jest.spyOn(vComposable.returns as object, 'activatedFn' as never)
    const deactivatedSpy = jest.spyOn(vComposable.returns as object, 'deactivatedFn' as never)

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

  it('implements errorCaptured', async () => {
    const lifecycleHookCallbacks = {
      errorCapturedFn() {},
    }

    const vComposable: Composable = {
      errorCaptured: lifecycleHookCallbacks.errorCapturedFn,
      returns: {
        ...lifecycleHookCallbacks,
      },
    }

    const errorCapturedSpy = jest.spyOn(vComposable.returns as object, 'errorCapturedFn' as never)

    const ChildComponent = defineComponent({
      name: 'ChildComponent',
      template: `<p>Error Component</p>`,
      setup() {
        throw new Error('Test error')
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
      setup() {
        vuelve(vComposable)()
      },
    })

    expect(() => {
      mount(parentComponent)
    }).toThrow()

    expect(errorCapturedSpy).toHaveBeenCalled()
  })

  it('implements serverPrefetch', async () => {
    function composable() {
      const val = ref(0)

      return { val }
    }

    function fakeFetch(text: any) {
      return Promise.resolve(text)
    }

    const lifecycleHookCallbacks = {
      async serverPrefetchFn(this: any) {
        this.val.value = (await fakeFetch('onServerPrefetch')) as number
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
