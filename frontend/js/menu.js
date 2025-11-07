/*  catálogo + carrito + repetir pedido */
function param(n){ return new URL(location.href).searchParams.get(n); }
function apiBase(){ return localStorage.getItem('ue_api') || 'http://127.0.0.1:4000'; }
function user(){ try{ return JSON.parse(localStorage.getItem('ue_user')||'{}'); }catch(e){return {};} }

new Vue({
  el:'#app',
  data:{
    base: apiBase(),
    uni: (param('uni')||'ucema').toLowerCase(),
    productos:[], categoria:'', q:'',
    carrito:[], error:''
  },
  computed:{
    filtrados(){
      let arr = this.productos;
      if(this.categoria) arr = arr.filter(p=>p.categoria===this.categoria);
      if(this.q) arr = arr.filter(p=>(p.nombre||'').toLowerCase().includes(this.q.toLowerCase()));
      return arr;
    },
    cantCarrito(){ return this.carrito.reduce((a,b)=>a+b.cantidad,0); },
    tieneRepetir(){
      const u = user(); if(!u.email) return false;
      return !!localStorage.getItem('last_pedido_'+u.email);
    }
  },
  created(){
    // cargo productos
    axios.get(this.base+'/api/productos?uni='+this.uni)
      .then(r=>{
        this.productos = (r.data||[]).map(p=>({...p, cantidad:1}));
        // carrito previo (si existe)
        const c = JSON.parse(localStorage.getItem('carrito')||'[]');
        this.carrito = Array.isArray(c)? c : [];
      })
      .catch(()=> this.error='No se pudo cargar el menú.');
  },
  methods:{
    agregar(p){
      const i = this.carrito.findIndex(x=>x.id===p.id);
      if(i>=0) this.carrito[i].cantidad += 1;
      else this.carrito.push({id:p.id, nombre:p.nombre, precio:p.precio, cantidad:1});
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    },
    repetirPedido(){
      const u=user(); if(!u.email) return;
      const last = JSON.parse(localStorage.getItem('last_pedido_'+u.email) || '[]');
      if(Array.isArray(last) && last.length){
        // reconstruyo nombres y precios desde productos
        const precios = {}; this.productos.forEach(p=>precios[p.id]=p.precio);
        const nombres = {}; this.productos.forEach(p=>nombres[p.id]=p.nombre);
        this.carrito = last.map(it=>({
          id:it.id,
          nombre:(nombres[it.id]||('#'+it.id)),
          precio:(precios[it.id]||0),
          cantidad:it.cantidad||1
        }));
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
      }
    },
    async irAPago(){
      try{
        const items = this.carrito.map(it=>({id:it.id, cantidad:it.cantidad}));
        const r = await axios.post(this.base+'/api/pedidos',{ uni:this.uni, items });
        const id = r.data && r.data.id;
        if(!id) throw new Error();
        // guardo "último pedido" por usuario
        const u=user(); if(u.email){ localStorage.setItem('last_pedido_'+u.email, JSON.stringify(items)); }
        window.location='pago.html?uni='+this.uni+'&pedido='+id;
      }catch(e){
        this.error='No se pudo cargar el menú.'; // genérico
      }
    }
  }
});


