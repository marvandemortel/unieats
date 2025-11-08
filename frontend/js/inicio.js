const FALLBACK_USER = { email: "usuario@ucema.edu.ar", pass: "12345678", uni: "ucema" };

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
      } catch (_) {
        
      }

     
      if (
        payload.email === FALLBACK_USER.email &&
        payload.password === FALLBACK_USER.pass &&
        payload.uni === FALLBACK_USER.uni
      ) {
        UE.set("user", { email: payload.email, uni: payload.uni });
        UE.set("cart", []);
        location.href = "menu.html";
        return;
      }

      this.error = "No se pudo iniciar sesión.";
    },
  },
});
