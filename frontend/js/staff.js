new Vue({
  el: "#app",
  data: () => ({
    user: null,
    productos: [],
    pedidos: [],
    nuevo: { nombre:"", precio:"", categoria:"comida", uni:"generic" },
    error:""
  }),
  async mounted(){
    this.user = UE.requireLogin();
    await this.cargarTodo();
  },
  methods:{
    async cargarTodo(){
      try{
        this.productos = await UE.getJSON("/api/productos");
        this.pedidos = await UE.getJSON("/api/pedidos");
      }catch(e){ this.error = "No se pudo cargar."; }
    },
    async crear(){
      try{
        const p = {...this.nuevo, precio: parseInt(this.nuevo.precio||0,10)};
        await UE.postJSON("/api/productos", p);
        this.nuevo = { nombre:"", precio:"", categoria:"comida", uni:"generic" };
        await this.cargarTodo();
      }catch(e){ this.error = "No se pudo crear."; }
    },
    async borrar(id){
      try{ await UE.delJSON(`/api/productos/${id}`); await this.cargarTodo(); }
      catch(e){ this.error = "No se pudo borrar."; }
    },
    async marcarPago(id, estado){
      try{ await UE.putJSON(`/api/pedidos/${id}`, { pago: estado }); await this.cargarTodo(); }
      catch(e){ this.error = "No se pudo actualizar."; }
    },
    async marcarEstado(id, estado){
      try{ await UE.putJSON(`/api/pedidos/${id}`, { estado }); await this.cargarTodo(); }
      catch(e){ this.error = "No se pudo actualizar."; }
    }
  }
});



