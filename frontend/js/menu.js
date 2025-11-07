new Vue({
  el: "#app",
  data() {
    return {
      productos: [],
      cat: "todo",
      q: "",
      cart: UE.cart(),
      error: ""
    };
  },
  computed: {
    filtrados() {
      let ps = this.productos;
      if (this.cat && this.cat !== "todo") ps = ps.filter(p => p.categoria === this.cat);
      if (this.q) ps = ps.filter(p => p.nombre.toLowerCase().includes(this.q.toLowerCase()));
      return ps;
    },
    count() { return this.cart.reduce((a, it) => a + it.cantidad, 0); }
  },
  async created() {
    try {
      const uni = (UE.user()?.uni) || "ucema";
      // productos ordenados por id desde el backend
      this.productos = await UE.get(`/api/productos?uni=${uni}`);
    } catch (_) {
      this.error = "No se pudo cargar el menú.";
    }
  },
  methods: {
    add(p) {
      const x = this.cart.find(i => i.id === p.id);
      if (x) x.cantidad++;
      else this.cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 });
      UE.setCart(this.cart);
    },
    irCarrito() { location.href = "carrito.html"; }
  }
});

