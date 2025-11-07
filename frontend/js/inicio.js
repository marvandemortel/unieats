// Login visual, sin pedir a la API
new Vue({
  el: '#app',
  data: {
    email: '',
    password: '',
    uni: 'UCEMA',
    cargando: false,
    error: ''
  },
  methods: {
    iniciar () {
      this.error = '';

      const mail = (this.email || '').toLowerCase().trim();
      if (!mail.endsWith('@ucema.edu.ar')) { this.error = 'Usá un email @ucema.edu.ar'; return; }
      if (!this.password) { this.error = 'Ingresá la contraseña.'; return; }

      this.cargando = true;

      // Guarda sesión local y sigue al menú (sin golpear /login)
      const user = { email: mail, uni: this.uni.toLowerCase() };
      localStorage.setItem('ue_user', JSON.stringify(user));
      // API por defecto para el resto del sitio (productos, pedidos, etc.)
      localStorage.setItem('ue_api', 'http://127.0.0.1:4000');

      window.location = 'menu.html?uni=' + this.uni.toLowerCase();
    }
  }
});

