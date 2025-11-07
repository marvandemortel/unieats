/* CRUD productos + tablero pedidos */
new Vue({
  el:'#app',
  data:{
    base: localStorage.getItem('ue_api') || 'http://127.0.0.1:4000',
    productos:[], form:{ id:'', nombre:'', precio:'', categoria:'comida', uni:'ucema' },
    categorias:['comida','panificado','bebida','promo'],
    filtro:{ cat:'', uni:'', q:'' }, enviandoProd:false, errorProd:'',
    pedidos:[], filtroPed:{ estado:'', desde:'' }, cargandoPed:false, errorPed:''
  },
  computed:{
    productosFiltrados(){
      return this.productos.filter(p=>{
        const catOk = !this.filtro.cat || p.categoria===this.filtro.cat;
        const uniOk = !this.filtro.uni || p.uni===this.filtro.uni;
        const qOk   = !this.filtro.q || (p.nombre||'').toLowerCase().includes(this.filtro.q.toLowerCase());
        return catOk && uniOk && qOk;
      });
    }
  },
  created(){ this.cargarProductos(); this.cargarPedidos(); },
  methods:{
    cargarProductos(){
      axios.get(this.base+'/api/productos')
        .then(r=> this.productos = r.data || [])
        .catch(()=> this.errorProd='No se pudo cargar la lista de productos.');
    },
    guardar(){
      this.errorProd='';
      if(!this.form.nombre || !this.form.precio){ this.errorProd='Completá nombre y precio.'; return; }
      this.enviandoProd=true;
      const data = { nombre:this.form.nombre, precio:Number(this.form.precero)||Number(this.form.precio)||0, categoria:this.form.categoria, uni:this.form.uni };
      const req = this.form.id ? axios.put(this.base+'/api/productos/'+this.form.id, data)
                               : axios.post(this.base+'/api/productos', data);
      req.then(()=>{ this.cancelarEdicion(); this.cargarProductos(); })
        .catch(()=> this.errorProd='No se pudo guardar el producto.')
        .then(()=> this.enviandoProd=false);
    },
    editar(p){ this.form = { id:p.id, nombre:p.nombre, precio:p.precio, categoria:p.categoria, uni:p.uni||'ucema' }; window.scrollTo({top:0, behavior:'smooth'}); },
    borrar(p){
      if(!confirm('¿Eliminar "'+p.nombre+'"?')) return;
      this.enviandoProd=true;
      axios.delete(this.base+'/api/productos/'+p.id)
        .then(()=> this.cargarProductos())
        .catch(()=> this.errorProd='No se pudo borrar el producto.')
        .then(()=> this.enviandoProd=false);
    },
    cancelarEdicion(){ this.form = { id:'', nombre:'', precio:'', categoria:'comida', uni:'ucema' }; this.errorProd=''; },
    cargarPedidos(){
      this.errorPed=''; this.cargandoPed=true;
      const q = [];
      if(this.filtroPed.estado) q.push('estado='+encodeURIComponent(this.filtroPed.estado));
      if(this.filtroPed.desde)  q.push('desde='+encodeURIComponent(this.filtroPed.desde));
      const url = this.base+'/api/pedidos' + (q.length?('?'+q.join('&')):'');
      axios.get(url)
        .then(r=> this.pedidos = r.data || [])
        .catch(()=> this.errorPed='No se pudo cargar pedidos.')
        .then(()=> this.cargandoPed=false);
    },
    setEstado(pedido, estado){
      this.cargandoPed=true; this.errorPed='';
      axios.put(this.base+'/api/pedidos/'+pedido.id, {estado})
        .then(()=> this.cargarPedidos())
        .catch(()=> this.errorPed='No se pudo actualizar el estado.')
        .then(()=> this.cargandoPed=false);
    },
    setPago(pedido, estado){
      this.cargandoPed=true; this.errorPed='';
      axios.put(this.base+'/api/pedidos/'+pedido.id, {pago:estado})
        .then(()=> this.cargarPedidos())
        .catch(()=> this.errorPed='No se pudo actualizar el pago.')
        .then(()=> this.cargandoPed=false);
    }
  }
});

