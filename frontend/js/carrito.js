new Vue({
  el: "#app",
  data() {
    return { items: UE.cart(), total: 0 };
  },
  created() { this.calc(); },
  methods: {
    calc() { this.total = this.items.reduce((a, i) => a + i.precio * i.cantidad, 0); UE.setCart(this.items); },
    mas(i) { i.cantidad++; this.calc(); },
    menos(i) { if (i.cantidad > 1) { i.cantidad--; this.calc(); } },
    quitar(idx) { this.items.splice(idx, 1); this.calc(); },
    pagar() { location.href = "pago.html"; }
  }
});


