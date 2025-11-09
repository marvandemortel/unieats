new Vue({
  el: "#app",
  data: () => ({
    order_id: UE.get("order_id", null),
    error: ""
  }),
  async mounted() {
    
  },
  computed: {
    
  },
  methods: {
    async cancelarPedido() {
        try {
            const data = await UE.delJSON(`/api/pedido/${this.order_id}`);
            
            if (data.ok) {
                UE.del("order_id");
                alert("Tu pedido ha sido cancelado exitosamente.");
                location.href = "menu.html";
            } else {
                this.error = "No se pudo cancelar el pedido. Por favor, intentá nuevamente.";
            }

        } catch (e) {
            console.error("Error al cancelar el pedido:", e);
            this.error = "No se pudo cancelar el pedido. Por favor, intentá nuevamente.";
        }
    }
  }
});


