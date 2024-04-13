import { onMounted as E, onBeforeUpdate as y, onUpdated as v, onBeforeUnmount as w, onUnmounted as j, onErrorCaptured as O, onRenderTracked as m, onRenderTriggered as k, onActivated as U, onDeactivated as C, onServerPrefetch as F, ref as T, watch as A, watchEffect as P, computed as x } from "vue";
import D from "lodash.clonedeep";
const K = (t) => typeof t == "function", { isArray: $ } = Array, l = {
  mounted: E,
  beforeUpdate: y,
  updated: v,
  beforeUnmount: w,
  unmounted: j,
  errorCaptured: O,
  renderTracked: m,
  renderTriggered: k,
  activated: U,
  deactivated: C,
  serverPrefetch: F
};
function R(t) {
  return function(...p) {
    let f = {}, u = {}, s = {}, h = {};
    const c = {};
    if (t.props) {
      const e = $(t.props), n = e ? t.props : Object.keys(t.props), o = (r) => Object.values(t.props)[r];
      p == null || p.forEach((r, i) => {
        if (e) {
          const d = t.props[i];
          d && (f = {
            ...f,
            [d]: r
          });
        } else {
          const d = n[i], a = o(i);
          if (d && a) {
            if (r.constructor.name !== a.name)
              throw new TypeError(
                `Invalid prop: type check failed for prop "${d}". Expected ${a == null ? void 0 : a.name}, got ${r.constructor.name}`
              );
            f = {
              ...f,
              [d]: r
            };
          }
        }
      });
    }
    if (t.data && K(t.data)) {
      const e = t.data();
      Object.entries(e).forEach(([n, o]) => {
        const r = T(D(o));
        u = {
          ...u,
          [n]: r
        };
      });
    }
    return Object.assign(c, u, f), t.methods && Object.entries(t.methods).forEach(([e, n]) => {
      s = {
        ...s,
        [e]: n.bind(c)
      };
    }), Object.assign(c, s), Object.entries(l).forEach(([e, n]) => {
      const o = e;
      if (t[o]) {
        const r = t[o];
        n((...i) => r.apply(c, i));
      }
    }), t.watch && Object.entries(t.watch).forEach(([e, n]) => {
      const o = n, r = c[e];
      r && A(r, o.bind(c));
    }), t.watchEffect && Object.values(t.watchEffect).forEach((e) => {
      P(e.bind(c));
    }), t.computed && Object.keys(t.computed).forEach((e) => {
      const n = t.computed && t.computed[e];
      n && (h = {
        ...h,
        [e]: x(n.bind(c))
      });
    }), {
      ...f,
      ...u,
      ...s,
      ...h
    };
  };
}
export {
  R as default
};
