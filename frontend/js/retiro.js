new Vue({
  el: "#app",
  data: () => ({
    user: null,
    horarios: [
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
    ],
    hora: "",
    enviando: false,
    error: ""
  }),
  mounted(){
    this.user = UE.requireLogin();
    if (!UE.get("cart", []).length) location.href = "menu.html";
  },
  methods:{
    async confirmar(){
      if(!this.hora){ this.error = "Elegí un horario."; return; }
      this.enviando = true; this.error = "";
      try{
        const cart = UE.get("cart", []);
        const items = cart.map(it => ({ id: it.id, cantidad: it.cantidad, nombre: it.nombre, precio: it.precio }));
        const data = await UE.postJSON("/api/pedidos", {
          uni: this.user.uni, items, hora: this.hora, email: this.user.email
        });
        UE.del("cart");
        UE.set('order_id', data.id);
        UE.del('pay_method');
        location.href = "confirmacion.html";
      }catch(e){
        this.error = "No se pudo confirmar.";
      }finally{
        this.enviando = false;
      }
    }
  }
});






