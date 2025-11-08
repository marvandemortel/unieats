(function(){
  const API = "http://127.0.0.1:4000";
  const V = "v2";
  const k = (n) => `ue_${V}_${n}`;
  const get = (n, d=null) => { const s = localStorage.getItem(k(n)); return s?JSON.parse(s):d; };
  const set = (n, v) => localStorage.setItem(k(n), JSON.stringify(v));
  const del = (n) => localStorage.removeItem(k(n));

  async function api(path, {method="GET", body}={}) {
    const r = await fetch(API+path, {
      method, headers:{ "Content-Type":"application/json" },
      body: body? JSON.stringify(body): undefined
    });
    let data = {}; try{ data = await r.json(); }catch{}
    if(!r.ok) throw new Error(data.error || "Error");
    return data;
  }

  function requireLogin(){
    const u = get("user");
    if(!u) location.href = "inicio.html";
    return u;
  }

  window.UE = {
    API, get, set, del, requireLogin,
    getJSON:(p)=>api(p),
    postJSON:(p,b)=>api(p,{method:"POST",body:b}),
    putJSON:(p,b)=>api(p,{method:"PUT",body:b}),
    delJSON:(p)=>api(p,{method:"DELETE"}),
    money:(n)=>"$"+(n||0).toLocaleString("es-AR")
  };
})();
