new Vue({
  el: "#app",
  data() {
    return {
      prods: [],
      nuevo: { nombre: "", precio: "", categoria: "", uni: "generic" },
      error: "",
      ok: ""
    };
  },
  async created() { await this.cargar(); },
  methods: {
    async cargar() {
      try {
        this.prods = await UE.get("/api/productos");
        this.prods = this.prods.sort((a, b) => a.id - b.id);
      } catch (_) { this.error = "No se pudo cargar productos."; }
    },
    async crear() {
      this.ok = ""; this.error = "";
      try {
        const body = {
          nombre: this.nuevo.nombre,
          precio: +this.nuevo.precio,
          categoria: this.nuevo.categoria,
          uni: this.nuevo.uni
        };
        await UE.post("/api/productos", body);
        this.nuevo = { nombre: "", precio: "", categoria: "", uni: "generic" };
        await this.cargar();
        this.ok = "Guardado";
      } catch (_) { this.error = "Datos inválidos."; }
    },
    async borrar(id) { await UE.delReq(`/api/productos/${id}`); await this.cargar(); }
  }
});

