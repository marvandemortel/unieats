new Vue({
  el: "#app",
  data: () => ({
    user: null,
    pedidos: [],
    error: ""
  }),
  async mounted(){
    this.user = UE.get("user") ? UE.get("user").email : UE.requireLogin();
    await this.getPedidos();
  },
  computed:{
    
  },
  methods:{
    async getPedidos(){
      try {
        const res = await UE.getJSON("/api/pedidos");
        this.pedidos = res.filter(p => p.email === this.user);
        // Los pedidos que tienen una hora mayor o igual a la hora actual están "Listos para retirar"
        const ahora = new Date();
        const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');
        this.pedidos.forEach(pedido => {
          pedido.estado = (pedido.hora <= horaActual) ? "Listo para retirar" : "En preparación";
        });
      } catch (e) {
        this.error = "No se pudieron cargar los pedidos.";
      }
    },
  }

});






