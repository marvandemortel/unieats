new Vue({
  el: "#app",
  data: () => ({
    user: null,
    pedido: null,
    error: ""
  }),
  async mounted(){
    this.user = UE.requireLogin();
    const id = UE.get("order_id", null);
    if (!id){ this.error = "Sin pedido."; return; }
    try{
      this.pedido = await UE.getJSON(`/api/pedidos/${id}`);
    }catch(e){
      this.error = "No se pudo cargar el pedido.";
    }
  },
  computed:{
    totalTxt(){ return this.pedido ? UE.money(this.pedido.total) : "$0"; }
  }
});






