"use strict";const t=require("vue"),E=require("lodash.clonedeep"),v={mounted:t.onMounted,beforeUpdate:t.onBeforeUpdate,updated:t.onUpdated,beforeUnmount:t.onBeforeUnmount,unmounted:t.onUnmounted,errorCaptured:t.onErrorCaptured,renderTracked:t.onRenderTracked,renderTriggered:t.onRenderTriggered,activated:t.onActivated,deactivated:t.onDeactivated,serverPrefetch:t.onServerPrefetch};function b(f,d){const u=d??f.returns??f,r=d?f:f.default??f,l=Object.keys(u),c={},n={},i={};return function(...m){m.forEach((e,o)=>{r.props&&(c[r.props[o]]=e)}),Object.entries(u).forEach(([e,o])=>{e!="default"&&(typeof o=="function"?n[e]=o.bind(c):c[e]=t.ref(E(o)))}),Object.entries(v).forEach(([e,o])=>{var p;const h=e;if(r[h]){const s=(p=r[h])==null?void 0:p.name;if(!s)return;o&&n[s]&&o(n[s])}}),r.watch&&Object.entries(r.watch).forEach(([e,o])=>{c[e]&&t.watch(c[e],n[o.name])}),r.watchEffect&&Object.values(r.watchEffect).forEach(e=>{t.watchEffect(n[e.name])}),r.computed&&Object.keys(r.computed).forEach(e=>{i[e]=t.computed(n[e])});const a={};return l.forEach(e=>{e!="default"&&(e in c&&(a[e]=c[e]),e in n&&(a[e]=n[e]),e in i&&(a[e]=i[e]))}),a}}module.exports=b;
