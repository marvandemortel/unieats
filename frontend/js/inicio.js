new Vue({
  el: '#app',
  data: {
    email: '',
    password: '',
    uni: 'UCEMA',
    cargando: false,
    error: ''
  },
  created () {
    // Si hay ue_api guardado pero está caído, lo borro en silencio
    const saved = localStorage.getItem('ue_api');
    if (saved) {
      axios.get(saved + '/health', { timeout: 800 })
        .catch(() => localStorage.removeItem('ue_api'));
    }
  },
  methods: {
    async detectarAPI () {
      // pruebo primero lo guardado y después 127.0.0.1 / localhost
      const bases = [
        localStorage.getItem('ue_api'),
        'http://127.0.0.1:4000',
        'http://localhost:4000'
      ].filter(Boolean);

      for (const b of bases) {
        try {
          const r = await axios.get(b + '/health', { timeout: 900 });
          if (r && r.data && r.data.ok) return b;
        } catch (_) { /* silencio total */ }
      }
      throw new Error('api');
    },

    async iniciar () {
      this.error = '';

      const mail = (this.email || '').toLowerCase().trim();
      if (!mail.endsWith('@ucema.edu.ar')) { this.error = 'Usá un email @ucema.edu.ar'; return; }
      if (!this.password) { this.error = 'Ingresá la contraseña.'; return; }

      this.cargando = true;
      try {
        const base = await this.detectarAPI();         // ← detecta sin mostrar nada técnico
        localStorage.setItem('ue_api', base);

        const r = await axios.post(base + '/login', {
          email: mail,
          password: this.password,
          uni: this.uni.toLowerCase()
        });

        if (r && r.data && r.data.ok) {
          localStorage.setItem('ue_user', JSON.stringify(r.data.user));
          window.location = 'menu.html?uni=' + this.uni.toLowerCase();
          return;
        }
        this.error = 'No se pudo iniciar sesión.';
      } catch (_) {
        // Cualquier cosa (API caída, CORS, red, etc.) → mensaje único y genérico
        this.error = 'No se pudo iniciar sesión.';
      } finally {
        this.cargando = false;
      }
    }
  }
});
