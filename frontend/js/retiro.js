new Vue({
  el: "#app",
  data: () => ({
    user: null,
    horas: ["10:00","10:15","10:30","10:45","11:00","11:15","11:30"],
    horaSel: "",
    enviando: false,
    error: ""
  }),
  mounted(){
    this.user = UE.requireLogin();
    if (!UE.get("cart", []).length) location.href = "menu.html";
  },
  methods:{
    async confirmar(){
      if(!this.horaSel){ this.error = "Elegí un horario."; return; }
      this.enviando = true; this.error = "";
      try{
        const cart = UE.get("cart", []);
        const items = cart.map(it => ({ id: it.id, cantidad: it.cantidad }));
        const data = await UE.postJSON("/api/pedidos", {
          uni: this.user.uni, items, hora: this.horaSel
        });
        UE.set("order_id", data.id);
        UE.del("cart");
        location.href = "confirmacion.html";
      }catch(e){
        this.error = "No se pudo confirmar.";
      }finally{
        this.enviando = false;
      }
    }
  }
});






