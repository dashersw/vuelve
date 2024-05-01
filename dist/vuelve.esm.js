import { onMounted as w, onBeforeUpdate as y, onUpdated as j, onBeforeUnmount as m, onUnmounted as O, onErrorCaptured as k, onRenderTracked as l, onRenderTriggered as $, onActivated as b, onDeactivated as C, onServerPrefetch as T, reactive as U, ref as v, watch as A, watchEffect as F, computed as q } from "vue";
import x from "lodash.clonedeep";
const h = (t) => typeof t == "function", P = (t) => Array.isArray(t);
function p(t) {
  return typeof t == "object" && (t.type === void 0 || typeof t.type == "function" || t.type === !0) && (t.required === void 0 || typeof t.required == "boolean") && (t.default === void 0 || typeof t.default == "function" || t.type !== !0 && typeof t.default === t.type.name.toLowerCase());
}
const D = {
  mounted: w,
  beforeUpdate: y,
  updated: j,
  beforeUnmount: m,
  unmounted: O,
  errorCaptured: k,
  renderTracked: l,
  renderTriggered: $,
  activated: b,
  deactivated: C,
  serverPrefetch: T
};
function L(t) {
  return function(o) {
    const d = {}, u = {}, a = {}, s = {}, i = {};
    if (t.props) {
      const c = P(t.props);
      (c ? Object.values(t.props) : Object.keys(t.props)).forEach((e) => {
        var f;
        if (c)
          o && o[e] && (d[e] = o[e]);
        else {
          const n = t.props[e];
          if (p(n)) {
            if (o && o[e]) {
              if (!n.type || n.type === !0)
                d[e] = o[e];
              else if (typeof n.type == "function")
                if (n.type.name === o[e].constructor.name)
                  d[e] = o[e];
                else
                  throw new TypeError(
                    `Invalid prop: type check failed for prop "${e}". Expected ${(f = n.type) == null ? void 0 : f.name}, got ${o[e].constructor.name}`
                  );
            } else if (n.default) {
              const E = h(n.default) ? n.default() : n.default;
              d[e] = E;
            } else if (n.required)
              throw new Error(`${e} is required but not provided.`);
          }
          if (!p(n) && o && o[e])
            if (n.name === o[e].constructor.name)
              d[e] = o[e];
            else
              throw new TypeError(
                `Invalid prop: type check failed for prop "${e}". Expected ${n.name}, got ${o[e].constructor.name}`
              );
        }
      });
    }
    if (t.data && h(t.data)) {
      const c = t.data();
      Object.entries(c).forEach(([r, e]) => {
        let f;
        typeof e == "object" && e !== null ? f = U(e) : f = v(x(e)), u[r] = f;
      });
    }
    return Object.assign(i, u, d), t.methods && Object.entries(t.methods).forEach(([c, r]) => {
      a[c] = r.bind(i);
    }), Object.assign(i, a), Object.entries(D).forEach(([c, r]) => {
      const e = c;
      if (t[e]) {
        const f = t[e];
        r((...n) => f.apply(i, n));
      }
    }), t.watch && Object.entries(t.watch).forEach(([c, r]) => {
      const e = r, f = i[c];
      f && A(f, e.bind(i));
    }), t.watchEffect && Object.values(t.watchEffect).forEach((c) => {
      F(c.bind(i));
    }), t.computed && Object.keys(t.computed).forEach((c) => {
      const r = t.computed && t.computed[c];
      r && (s[c] = q(r.bind(i)));
    }), {
      ...d,
      ...u,
      ...a,
      ...s
    };
  };
}
export {
  L as default
};
