new Vue({
  el: "#app",
  data() {
    return { metodo: "", error: "", items: UE.cart(), total: 0 };
  },
  created() { this.total = this.items.reduce((a, i) => a + i.precio * i.cantidad, 0); },
  methods: {
    elegir(m) { this.metodo = m; },
    continuar() {
      if (!this.metodo) { this.error = "Elegí un método de pago."; return; }
      UE.set("ue_pago", this.metodo);
      location.href = "retiro.html";
    }
  }
});




