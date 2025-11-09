new Vue({
  el: "#app",
  data: () => ({
    user: null,
    lista: [],
    categoria: "todo",
    q: "",
    error: "",
    cantCarrito: 0,
    carrito: []
  }),
  async mounted() {
    this.user = UE.requireLogin();
    await this.cargar();
    this.actualizarCarrito();
    this.actualizarContador();
  },
  computed: {
    filtrados() {
      let xs = this.lista;
      if (this.categoria !== "todo") xs = xs.filter(p => p.categoria === this.categoria);
      if (this.q) xs = xs.filter(p => p.nombre.toLowerCase().includes(this.q.toLowerCase()));
      return xs;
    }
  },
  methods: {
    async cargar() {
      try {
        const params = this.categoria === "todo" ? "" : `?categoria=${encodeURIComponent(this.categoria)}`;
        const prods = await UE.getJSON(`/api/productos${params}`);
        this.lista = prods; // ya viene ordenado por id
      } catch (e) {
        this.error = "No se pudo cargar el menú.";
      }
    },
    cantidadEnCarrito(p) {
      const cart = UE.get("cart", []);
      const item = cart.find(it => it.id === p.id);
      return item ? item.cantidad : 0;
    },
    quitar(p) {
      const cart = UE.get("cart", []);
      const i = cart.findIndex(it => it.id === p.id);
      if (i !== -1) {
        cart[i].cantidad -= 1;
        if (cart[i].cantidad <= 0) cart.splice(i, 1);
        UE.set("cart", cart);
        this.actualizarCarrito();
        this.actualizarContador();
      }
    },
    agregar(p) {
      const cart = UE.get("cart", []);
      const i = cart.findIndex(it => it.id === p.id);
      if (i === -1) cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 });
      else cart[i].cantidad += 1;
      UE.set("cart", cart);
      this.actualizarCarrito();
      this.actualizarContador();
    },
    actualizarContador() {
      const cart = UE.get("cart", []);
      this.cantCarrito = cart.reduce((a, b) => a + (b.cantidad || 0), 0);
    },
    actualizarCarrito() {
      this.carrito = UE.get("cart", []);
    },
    irCarrito() { location.href = "carrito.html"; },
    irAPago() { location.href = "pago.html"; },
  }
});


