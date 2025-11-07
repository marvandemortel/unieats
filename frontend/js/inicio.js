// Login visual (valida dominio y guarda usuario)
new Vue({
  el:'#app',
  data:()=>({ email:'', password:'', uni:'UCEMA', enviando:false, error:'' }),
  methods:{
    iniciar(){
      this.error='';
      const mail=(this.email||'').toLowerCase().trim();
      if(!mail.endsWith('@ucema.edu.ar')){ this.error='Usá tu email @ucema.edu.ar'; return; }
      if(!this.password){ this.error='Ingresá la contraseña.'; return; }
      this.enviando=true;
      // guardo usuario y base de API (default)
      localStorage.setItem('ue_user', JSON.stringify({email:mail, uni:this.uni}));
      if(!localStorage.getItem('ue_api')) localStorage.setItem('ue_api','http://127.0.0.1:4000');
      location.href='menu.html';
    }
  }
});
