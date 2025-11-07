new Vue({
  el: "#app",
  data() {
    return { pedido: null, error: "" };
  },
  async created() {
    try {
      const id = UE.get("ue_pedido_id");
      if (!id) { this.error = "No hay pedido."; return; }
      this.pedido = await UE.get(`/api/pedidos/${id}`);
    } catch (_) {
      this.error = "No se pudo cargar el pedido.";
    }
  }
});




