// Login visual y autodetección de API (health)
new Vue({
  el:'#app',
  data:()=>({ email:'', password:'', uni:'UCEMA', enviando:false, error:'' }),
  methods:{
    async detectarAPI(){
      const bases = ['http://127.0.0.1:4000','http://localhost:4000'];
      for (const b of bases){
        try{ const r = await axios.get(b+'/health',{timeout:1200}); if(r.data && r.data.ok) return b; }catch(_){}
      }
      return null;
    },
    async iniciar(){
      this.error='';
      const mail=(this.email||'').toLowerCase().trim();
      if(!mail.endsWith('@ucema.edu.ar')){ this.error='Usá tu email @ucema.edu.ar'; return; }
      if(!this.password){ this.error='Ingresá la contraseña.'; return; }
      this.enviando=true;
      const base = await this.detectarAPI();
      if(!base){ this.error='No encuentro la API en :4000. ¿Encendiste el backend?'; this.enviando=false; return; }
      localStorage.setItem('ue_api', base);
      localStorage.setItem('ue_user', JSON.stringify({email:mail, uni:this.uni}));
      location.href='menu.html';
    }
  }
});

