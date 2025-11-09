new Vue({
  el: "#app",
  data: () => ({
    email: "",
    password: "",
    uni: "ucema",
    error: ""
  }),
  methods: {
    async login() {
      this.error = "";

      const payload = {
        email: (this.email || "").trim().toLowerCase(),
        password: this.password || "",
        uni: ((this.uni || "ucema") + "").toLowerCase(),
      };
      
      try {
        const res = await UE.postJSON("/login", payload);
        if (res && res.ok && res.user) {
          UE.set("user", res.user);
          UE.set("cart", []);
          location.href = "menu.html";
          return;
        }
      } catch (e) {
        console.error(e);
        this.error = "No se pudo iniciar sesión.";
      }
    },
  },
});
