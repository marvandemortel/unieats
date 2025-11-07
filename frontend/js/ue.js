// Base de la API (backend Flask en 127.0.0.1:4000)
const API = "http://127.0.0.1:4000";

const UE = {
  // localStorage helpers
  get(k, d = null) { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); },

  user() { return UE.get("ue_user"); },
  setUser(u) { UE.set("ue_user", u); },

  cart() { return UE.get("ue_cart", []); },
  setCart(c) { UE.set("ue_cart", c); },

  // fetch JSON helpers
  async j(method, path, body) {
    const opt = { method, headers: { "Content-Type": "application/json" } };
    if (body) opt.body = JSON.stringify(body);
    const r = await fetch(`${API}${path}`, opt);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw (data && data.error) || "Error";
    return data;
  },
  get(p) { return UE.j("GET", p); },
  post(p, b) { return UE.j("POST", p, b); },
  put(p, b) { return UE.j("PUT", p, b); },
  delReq(p) { return UE.j("DELETE", p); }
};
