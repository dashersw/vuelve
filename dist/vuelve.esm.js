import { ref as h, onMounted as p, watch as m, watchEffect as E, computed as l } from "vue";
import w from "lodash.clonedeep";
function v(o, u) {
  const a = u || o.returns || o, f = u ? o : o.default || o, s = Object.keys(a), e = {}, c = {}, i = {};
  return function(...d) {
    d.forEach((t, n) => {
      f.props && (e[f.props[n]] = t);
    }), Object.entries(a).forEach(([t, n]) => {
      t != "default" && (typeof n == "function" ? c[t] = n.bind(e) : e[t] = h(w(n)));
    }), f.mounted && p(c[f.mounted.name]), f.watch && Object.entries(f.watch).forEach(([t, n]) => {
      m(e[t], c[n.name]);
    }), f.watchEffect && Object.values(f.watchEffect).forEach((t) => {
      E(c[t.name]);
    }), f.computed && Object.keys(f.computed).forEach((t) => {
      i[t] = l(c[t]);
    });
    const r = {};
    return s.forEach((t) => {
      t != "default" && (t in e && (r[t] = e[t]), t in c && (r[t] = c[t]), t in i && (r[t] = i[t]));
    }), r;
  };
}
export {
  v as default
};
