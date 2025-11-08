new Vue({
  el: "#app",
  data: () => ({
    user: null,
    cart: [],
    error: ""
  }),
  mounted() {
    this.user = UE.requireLogin();
    this.cart = UE.get("cart", []);
  },
  computed: {
    total() { return this.cart.reduce((t, it) => t + it.precio * it.cantidad, 0); },
    totalTxt() { return UE.money(this.total); }
  },
  methods: {
    inc(i){ this.cart[i].cantidad++; UE.set("cart", this.cart); },
    dec(i){ this.cart[i].cantidad = Math.max(1, this.cart[i].cantidad-1); UE.set("cart", this.cart); },
    rm(i){ this.cart.splice(i,1); UE.set("cart", this.cart); },
    continuar(){
      if (!this.cart.length) { this.error = "El carrito está vacío."; return; }
      location.href = "pago.html";
    }
  }
});




