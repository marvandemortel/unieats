new Vue({
  el: "#app",
  data: () => ({
    email: "",
    password: "",
    uni: "ucema",
    error: ""
  }),
  methods: {
    async register() {
        this.error = "";

        try {
            const payload = {
                email: (this.email || "").trim().toLowerCase(),
                password: this.password || "",
                uni: ((this.uni || "ucema") + "").toLowerCase(),
            };

            const res = await UE.postJSON("/register", payload);
            if (res && res.ok) {
                location.href = "inicio.html";
            } else this.error = "No se pudo registrar.";

        } catch (e) {
            console.error(e);
            this.error = "No se pudo registrar.";
        };
    }
  },
});
