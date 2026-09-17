//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.prototype, s = Array.prototype, c = Object.getPrototypeOf, l = Object.isExtensible, u = () => {};
function d(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function f() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var p = 1024, m = 2048, h = 4096, g = 8192, ee = 16384, te = 32768, ne = 1 << 25, re = 65536, ie = 1 << 19, ae = 1 << 20, _ = 65536, oe = 1 << 21, se = 1 << 23, ce = Symbol("$state"), le = Symbol("component"), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/constants.js
var v = Symbol("uninitialized");
function he() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ge() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function _e(e) {
	return e === this.v;
}
function ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ye() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function xe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Se() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var y = null;
function Ce(e) {
	y = e;
}
function we(e, t = !1, n) {
	y = {
		p: y,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: null
	};
}
function Te(e) {
	var t = y, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) gt(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, y = t.p, Ee(e);
}
function Ee(e = {}) {
	return i(e, le, { value: !0 }), e;
}
function De() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var b = [];
function Oe() {
	var e = b;
	b = [], d(e);
}
function x(e) {
	if (b.length === 0 && !He) {
		var t = b;
		queueMicrotask(() => {
			t === b && Oe();
		});
	}
	b.push(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var ke = ~(m | h | p);
function S(e, t) {
	e.f = e.f & ke | t;
}
function Ae(e) {
	e.f & 512 || e.deps === null ? S(e, p) : S(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function je(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= _, je(t.deps));
}
function Me(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), je(e.deps), S(e, p);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Ne(e) {
	var t = z, n = H;
	V(null), U(null);
	try {
		return e();
	} finally {
		V(t), U(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/deriveds.js
var Pe = Symbol("obsolete");
function Fe(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) I(t[n]);
	}
}
function Ie(e) {
	var t, n = H, r = e.parent;
	if (!R && r !== null && e.v !== v && r.f & 24576) return he(), e.v;
	U(r);
	try {
		e.f &= ~_, Fe(e), t = Lt(e);
	} finally {
		U(n);
	}
	return t;
}
function Le(e) {
	var t = Ie(e);
	if (!e.equals(t) && (e.wv = Ft(), (!w?.is_fork || e.deps === null) && (w === null ? e.v = t : (w.capture(e, t, !0), Be?.capture(e, t, !0)), e.deps === null))) {
		S(e, p);
		return;
	}
	R || (T === null ? Ae(e) : (ht() || w?.is_fork) && T.set(e, t));
}
function Re(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Ne(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = u), Z(t, 0), St(t));
}
function ze(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Q(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var C = null, w = null, Be = null, T = null, Ve = null, He = !1, Ue = !1, E = null, We = null, Ge = 0, Ke = 1, qe = class e {
	id = Ke++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		C === null ? C = this : (C.#n = this, this.#t = C), C = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) S(r, m), t(r);
			for (r of n.m) S(r, h), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ge++ > 1e3 && (this.#x(), Je());
		for (let e of this.#u) this.#d.delete(e), S(e, m), this.schedule(e);
		for (let e of this.#d) S(e, h), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = E = [], r = [], i = We = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Qe(e), this.#h() || this.discard(), t;
		}
		if (w = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (E = null, We = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ze(e, t);
			i.length > 0 && w.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Be = this, Ye(r), Ye(n), Be = null, this.#s?.resolve();
		var s = w;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (k.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= p;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= p : i & 4 ? t.push(r) : X(r) && (i & 16 && this.#d.add(r), Q(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), S(i, m), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), w = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) Me(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== v && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), T?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		w = this;
	}
	deactivate() {
		w = null, T = null;
	}
	flush() {
		try {
			Ue = !0, w = this, this.#g();
		} finally {
			Ge = 0, Ve = null, E = null, We = null, Ue = !1, w = null, T = null, k.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Pe);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, x(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= f()).promise;
	}
	static ensure() {
		if (w === null) {
			let t = w = new e();
			!Ue && x(() => {
				t.#e || t.flush();
			});
		}
		return w;
	}
	apply() {
		T = null;
	}
	schedule(e) {
		if (Ve = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (E !== null && t === H && (z === null || !(z.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= p;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? C = e : t.#t = e, this.linked = !1;
		}
	}
};
function Je() {
	try {
		ve();
	} catch (e) {
		P(e, Ve);
	}
}
var D = null;
function Ye(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && X(r) && (D = /* @__PURE__ */ new Set(), Q(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Tt(r), D?.size > 0)) {
				k.clear();
				for (let e of D) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) D.has(n) && (D.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Q(n);
					}
				}
				D.clear();
			}
		}
		D = null;
	}
}
function Xe(e) {
	w.schedule(e);
}
function Ze(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), S(e, p);
		for (var n = e.first; n !== null;) Ze(n, t), n = n.next;
	}
}
function Qe(e) {
	S(e, p);
	for (var t = e.first; t !== null;) Qe(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var O = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map(), $e = !1;
function et(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: _e,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = et(e, t);
	return jt(n), n;
}
function j(e, t, n = !1) {
	return z !== null && (!B || z.f & 131072) && De() && z.f & 4325394 && (W === null || !W.has(e)) && xe(), tt(e, n ? N(t) : t, We);
}
function tt(e, t, n = null) {
	if (!e.equals(t)) {
		R ? k.set(e, t) : k.has(e) || k.set(e, e.v);
		var r = qe.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Ie(t), T === null && Ae(t);
		}
		e.wv = Ft(), rt(e, m, n), De() && H !== null && H.f & 1024 && !(H.f & 96) && (q === null ? Mt([e]) : q.push(e)), !r.is_fork && O.size > 0 && !$e && nt();
	}
	return t;
}
function nt() {
	$e = !1;
	for (let e of O) {
		e.f & 1024 && S(e, h);
		let t;
		try {
			t = X(e);
		} catch {
			t = !0;
		}
		t && Q(e);
	}
	O.clear();
}
function M(e) {
	j(e, e.v + 1);
}
function rt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = De(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== H) {
			var l = (c & m) === 0;
			if (l && S(s, t), c & 131072) O.add(s);
			else if (c & 2) {
				var u = s;
				T?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= _), rt(u, h, n));
			} else if (l) {
				var d = s;
				c & 16 && D !== null && D.add(d), n === null ? Xe(d) : n.push(d);
			}
		}
	}
}
function N(t) {
	if (typeof t != "object" || !t || ce in t || le in t) return t;
	let n = c(t);
	if (n !== o && n !== s) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), l = /* @__PURE__ */ A(0), u = null, d = Y, f = (e) => {
		if (Y === d) return e();
		var t = z, n = Y;
		V(null), Pt(d);
		var r = e();
		return V(t), Pt(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ A(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ye();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ A(n.value, u);
				return r.set(t, e), e;
			}) : j(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ A(v, u));
					r.set(t, e), M(l);
				}
			} else j(n, v), M(l);
			return !0;
		},
		get(e, n, i) {
			if (n === ce) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ A(N(s ? e[n] : v), u)), r.set(n, o)), o !== void 0) {
				var c = $(o);
				return c === v ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = $(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== v) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ce) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== v || Reflect.has(e, t);
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ A(i ? N(e[t]) : v, u)), r.set(t, n)), $(n) === v) ? !1 : i;
		},
		set(e, t, n, o) {
			var s = r.get(t), c = t in e;
			if (i && t === "length") for (var d = n; d < s.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ A(v, u)), r.set(d + "", p)) : j(p, v);
			}
			if (s === void 0) (!c || a(e, t)?.writable) && (s = f(() => /* @__PURE__ */ A(void 0, u)), j(s, N(n)), r.set(t, s));
			else {
				c = s.v !== v;
				var m = f(() => N(n));
				j(s, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(o, n), !c) {
				if (i && typeof t == "string") {
					var g = r.get("length"), ee = Number(t);
					Number.isInteger(ee) && ee >= g.v && j(g, ee + 1);
				}
				M(l);
			}
			return !0;
		},
		ownKeys(e) {
			$(l);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== v;
			});
			for (var [n, i] of r) i.v !== v && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			be();
		}
	});
}
var it, at, ot, st;
function ct() {
	if (it === void 0) {
		it = window, at = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		ot = a(t, "firstChild").get, st = a(t, "nextSibling").get, l(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), l(n) && (n[pe] = void 0);
	}
}
function lt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ut(e) {
	return ot.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function dt(e) {
	return st.call(e);
}
function ft(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function pt(e) {
	var t = H;
	if (t === null) return z.f |= se, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	P(e, t);
}
function P(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function mt(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function F(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= g);
	var r = {
		ctx: y,
		deps: null,
		nodes: null,
		f: e | m | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	w?.register_created_effect(r);
	var i = r;
	if (e & 4) E === null ? qe.ensure().schedule(r) : E.push(r);
	else if (t !== null) {
		try {
			Q(r);
		} catch (e) {
			throw I(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= re));
	}
	if (i !== null && (i.parent = n, n !== null && mt(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function ht() {
	return z !== null && !B;
}
function gt(e) {
	return F(4 | ae, e);
}
function _t(e) {
	qe.ensure();
	let t = F(64 | ie, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Et(t, () => {
			I(t), n(void 0);
		}) : (I(t), n(void 0));
	});
}
function vt(e, t = 0) {
	return F(8 | t, e);
}
function yt(e, t = 0) {
	return F(16 | t, e);
}
function bt(e) {
	return F(32 | ie, e);
}
function xt(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = R, r = z;
		At(!0), V(null);
		try {
			t.call(null);
		} catch (t) {
			P(t, e.parent);
		} finally {
			At(n), V(r);
		}
	}
}
function St(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Ne(() => {
			e.abort(me);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : I(n, t), n = r;
	}
}
function Ct(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || I(t), t = n;
	}
}
function I(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (wt(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, St(e, t && !n), Z(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	xt(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && Tt(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function wt(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ dt(e);
		e.remove(), e = n;
	}
}
function Tt(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Et(e, t, n = !0) {
	var r = [];
	e.f |= 256, Dt(e, r, !0);
	var i = () => {
		n && I(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Dt(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= g;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Dt(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Ot(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ dt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var kt = null, L = !1, R = !1;
function At(e) {
	R = e;
}
var z = null, B = !1;
function V(e) {
	z = e;
}
var H = null;
function U(e) {
	H = e;
}
var W = null;
function jt(e) {
	z !== null && (W ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function Mt(e) {
	q = e;
}
var Nt = 1, J = 0, Y = J;
function Pt(e) {
	Y = e;
}
function Ft() {
	return ++Nt;
}
function X(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~_), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (X(a) && Le(a), a.wv > e.wv) return !0;
		}
		t & 512 && T === null && S(e, p);
	}
	return !1;
}
function It(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(W !== null && W.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? It(a, t, !1) : t === a && (n ? S(a, m) : a.f & 1024 && S(a, h), Xe(a));
	}
}
function Lt(e) {
	var t = G, n = K, r = q, i = z, a = W, o = y, s = B, c = Y, l = e.f;
	G = null, K = 0, q = null, z = l & 96 ? null : e, W = null, Ce(e.ctx), B = !1, Y = ++J, e.ac !== null && (Ne(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= te;
		var f = Rt(e);
		if (De() && q !== null && !B && f !== null && !(e.f & 6146)) for (var p = 0; p < q.length; p++) It(q[p], e);
		if (i !== null && i !== e) {
			if (J++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = J;
			if (t !== null) for (let e of t) e.rv = J;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= se), d;
	} catch (t) {
		return Rt(e), pt(t);
	} finally {
		e.f ^= oe, G = t, K = n, q = r, z = i, W = a, Ce(o), B = s, Y = c;
	}
}
function Rt(e) {
	var t = e.deps, n = w?.is_fork;
	if (G !== null) {
		var r;
		if (n || Z(e, K), t !== null && K > 0) for (t.length = K + G.length, r = 0; r < G.length; r++) t[K + r] = G[r];
		else e.deps = t = G;
		if (ht() && e.f & 512) for (r = K; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && K < t.length && (Z(e, K), t.length = K);
	return t;
}
function zt(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (G === null || !n.call(G, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~_), s.v !== v && Ae(s), s.ac !== null && Ne(() => {
			s.ac.abort(me), s.ac = null, S(s, m);
		}), Re(s), Z(s, 0);
	}
}
function Z(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) zt(e, n[r]);
}
function Q(e) {
	var t = e.f;
	if (!(t & 16384)) {
		S(e, p);
		var n = H, r = L;
		H = e, L = !(t & 96);
		try {
			t & 16777232 ? Ct(e) : St(e), xt(e);
			var i = Lt(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Nt;
		} finally {
			L = r, H = n;
		}
	}
}
function $(e) {
	var t = !!(e.f & 2);
	if (kt?.add(e), z !== null && !B && !(H !== null && H.f & 16384) && (W === null || !W.has(e))) {
		var r = z.deps;
		if (z.f & 2097152) e.rv < J && (e.rv = J, G === null && r !== null && r[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			z.deps ??= [], n.call(z.deps, e) || z.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [z] : n.call(i, z) || i.push(z);
		}
	}
	if (R && k.has(e)) return k.get(e);
	if (t) {
		var a = e;
		if (R) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Vt(a)) && (o = Ie(a)), k.set(a, o), o;
		}
		var s = !(a.f & 512) && !B && z !== null && (L || !!(z.f & 512)), c = (a.f & te) === 0;
		X(a) && (s && (a.f |= 512), Le(a)), s && !c && (ze(a), Bt(a));
	}
	if (T?.has(e)) return T.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Bt(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (ze(t), Bt(t));
}
function Vt(e) {
	if (e.v === v) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (k.has(t) || t.f & 2 && Vt(t)) return !0;
	return !1;
}
function Ht(e) {
	var t = B;
	try {
		return B = !0, e();
	} finally {
		B = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Ut = ["touchstart", "touchmove"];
function Wt(e) {
	return Ut.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Gt = Symbol("events"), Kt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Set(), Jt = null, Yt = !1;
function Xt(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Jt = e, Yt || (Yt = !0, setTimeout(() => {
		Yt = !1, Jt = null;
	}));
	var s = 0, c = Jt === e && e[Gt];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Gt] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = z, f = H;
		V(null), U(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[Gt]?.[r];
					h != null && (!o.disabled || e.target === o) && h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[Gt] = t, delete e.currentTarget, V(d), U(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Zt = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Qt(e) {
	return Zt?.createHTML(e) ?? e;
}
function $t(e) {
	var t = ft("template");
	return t.innerHTML = Qt(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function en(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function tn(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		i === void 0 && (i = $t(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ut(i)));
		var t = r || at ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ut(t), s = t.lastChild;
			en(o, s);
		} else en(t, t);
		return t;
	};
}
function nn(e, t) {
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function rn(e) {
	let t = 0, n = et(0), r;
	return () => {
		ht() && ($(n), vt(() => (t === 0 && (r = Ht(() => e(() => M(n)))), t += 1, () => {
			x(() => {
				--t, t === 0 && (r?.(), r = void 0, M(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var an = re | ie;
function on(e, t, n, r) {
	new sn(e, t, n, r);
}
var sn = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t;
	#n;
	#r;
	#i = null;
	#a = null;
	#o = null;
	#s = null;
	#c = 0;
	#l = 0;
	#u = !1;
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Set();
	#p = null;
	#m = rn(() => (this.#p = et(this.#c), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#r = yt(() => {
			this.#g();
		}, an);
	}
	#h(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				ge();
				return;
			}
			t = !0, n && Se(), this.#o !== null && Et(this.#o, () => {
				this.#o = null;
			}), this.#v(() => {
				this.#g();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#t.onerror?.(e, r), n = !1;
				} catch (e) {
					P(e, this.#r && this.#r.parent);
				}
			}
		};
	}
	#g() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#l = 0, this.#c = 0, this.#i = bt(() => {
				this.#n(this.#e);
			}), this.#l > 0) {
				var e = this.#s = document.createDocumentFragment();
				Ot(this.#i, e);
				let t = this.#t.pending;
				this.#a = bt(() => t(this.#e));
			} else this.#_(w);
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		this.is_pending = !1, e.transfer_effects(this.#d, this.#f);
	}
	defer_effect(e) {
		Me(e, this.#d, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#t.pending;
	}
	#v(e) {
		var t = H, n = z, r = y;
		U(this.#r), V(this.#r), Ce(this.#r.ctx);
		try {
			return qe.ensure(), e();
		} finally {
			U(t), V(n), Ce(r);
		}
	}
	#y(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#y(e, t);
			return;
		}
		this.#l += e, this.#l === 0 && (this.#_(t), this.#a && Et(this.#a, () => {
			this.#a = null;
		}), this.#s &&= (this.#e.before(this.#s), null));
	}
	update_pending_count(e, t) {
		this.#y(e, t), this.#c += e, !(!this.#p || this.#u) && (this.#u = !0, x(() => {
			this.#u = !1, this.#p && tt(this.#p, this.#c);
		}));
	}
	get_effect_pending() {
		return this.#m(), $(this.#p);
	}
	error(e) {
		if (!this.#t.onerror && !this.#t.failed) throw e;
		w?.is_fork ? (this.#i && w.skip_effect(this.#i), this.#a && w.skip_effect(this.#a), this.#o && w.skip_effect(this.#o), w.oncommit(() => {
			this.#b(e);
		})) : this.#b(e);
	}
	#b(e) {
		this.#i &&= (I(this.#i), null), this.#a &&= (I(this.#a), null), this.#o &&= (I(this.#o), null);
		let t = this.#t.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#h(e);
			r(), t && (this.#o = this.#v(() => {
				try {
					return bt(() => {
						var r = H;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return P(e, this.#r.parent), null;
				}
			}));
		};
		x(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				P(e, this.#r && this.#r.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => P(e, this.#r && this.#r.parent)) : n(t);
		});
	}
};
function cn(e, t) {
	return un(e, t);
}
var ln = /* @__PURE__ */ new Map();
function un(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	ct();
	var l = void 0, u = _t(() => {
		var s = n ?? t.appendChild(lt());
		on(s, { pending: () => {} }, (t) => {
			we({});
			var n = y;
			o && (n.c = o), a && (i.$$events = a), l = e(t, i) || Ee(), Te();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = Wt(r);
					for (let e of [t, document]) {
						var a = ln.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ln.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Xt, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(Kt)), qt.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = ln.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Xt), r.delete(e), r.size === 0 && ln.delete(n)) : r.set(e, i);
			}
			qt.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return dn.set(l, u), l;
}
var dn = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/App.svelte
var fn = /* @__PURE__ */ tn("<main class=\"svelte-1n46o8q\"><h1>Maperture</h1> <p>Svelte 5 rebuild scaffold — nothing ported yet.</p></main>");
function pn(e, t) {
	nn(e, fn());
}
//#endregion
//#region src/main.js
var mn = (e, t) => cn(pn, {
	target: e,
	props: t
});
//#endregion
export { mn as startApp };

//# sourceMappingURL=bundle.js.map