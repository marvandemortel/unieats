new Vue({
  el: "#app",
  data() {
    return { email: "", pass: "", uni: "ucema", error: "" };
  },
  methods: {
    async login() {
      this.error = "";
      try {
        const res = await UE.post("/login", {
          email: this.email,
          password: this.pass,
          uni: this.uni
        });
        UE.setUser(res.user);
        // limpiá carrito de sesiones anteriores
        UE.setCart([]);
        location.href = "menu.html";
      } catch (_) {
        this.error = "No se pudo iniciar sesión.";
      }
    }
  }
});

