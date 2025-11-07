new Vue({
  el: "#app",
  data() {
    return { hora: "", enviando: false, error: "" };
  },
  methods: {
    async confirmar() {
      if (!this.hora) { this.error = "Elegí un horario."; return; }
      try {
        this.enviando = true;
        const user = UE.user() || { uni: "ucema", email: "anon@ucema.edu.ar" };
        const items = UE.cart().map(i => ({ id: i.id, cantidad: i.cantidad }));
        const r = await UE.post("/api/pedidos", { uni: user.uni, items, hora: this.hora });
        UE.set("ue_pedido_id", r.id);
        // vaciamos el carrito una vez creado el pedido
        UE.setCart([]);
        location.href = "confirmacion.html";
      } catch (_) {
        this.error = "No se pudo confirmar.";
      } finally {
        this.enviando = false;
      }
    }
  }
});




