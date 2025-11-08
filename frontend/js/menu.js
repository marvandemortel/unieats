new Vue({
  el: "#app",
  data: () => ({
    user: null,
    lista: [],
    filtro: "todo",
    q: "",
    error: "",
    carritoCant: 0
  }),
  async mounted() {
    this.user = UE.requireLogin();
    await this.cargar();
    this.actualizarContador();
  },
  computed: {
    filtrados() {
      let xs = this.lista;
      if (this.filtro !== "todo") xs = xs.filter(p => p.categoria === this.filtro);
      if (this.q) xs = xs.filter(p => p.nombre.toLowerCase().includes(this.q.toLowerCase()));
      return xs;
    }
  },
  methods: {
    async cargar() {
      try {
        const params = this.filtro === "todo" ? "" : `?categoria=${encodeURIComponent(this.filtro)}`;
        const prods = await UE.getJSON(`/api/productos${params}`);
        this.lista = prods; // ya viene ordenado por id
      } catch (e) {
        this.error = "No se pudo cargar el menú.";
      }
    },
    agregar(p) {
      const cart = UE.get("cart", []);
      const i = cart.findIndex(it => it.id === p.id);
      if (i === -1) cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 });
      else cart[i].cantidad += 1;
      UE.set("cart", cart);
      this.actualizarContador();
    },
    actualizarContador() {
      const cart = UE.get("cart", []);
      this.carritoCant = cart.reduce((a, b) => a + (b.cantidad || 0), 0);
    },
    irCarrito() { location.href = "carrito.html"; }
  }
});


