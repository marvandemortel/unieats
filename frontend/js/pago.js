new Vue({
  el: "#app",
  data: () => ({
    user: null,
    metodo: "",
    error: ""
  }),
  mounted(){
    this.user = UE.requireLogin();
    if (!UE.get("cart", []).length) location.href = "menu.html";
  },
  methods:{
    elegir(m){ this.metodo = m; },
    continuar(){
      if(!this.metodo){ this.error = "Elegí un método de pago."; return; }
      UE.set("pay_method", this.metodo);
      location.href = "retiro.html";
    }
  }
});






