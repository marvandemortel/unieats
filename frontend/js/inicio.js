/* Login visual (email UCEMA) + detección de API */
new Vue({
  el:'#app',
  data:{ email:'', password:'', uni:'UCEMA', cargando:false, error:'' },
  methods:{
    async detectarAPI(){
      // pruebo 127.0.0.1 y localhost:4000
      const bases = ['http://127.0.0.1:4000','http://localhost:4000'];
      for(const b of bases){
        try{
          const r = await axios.get(b+'/health', {timeout:1200});
          if(r.data && r.data.ok){ return b; }
        }catch(e){}
      }
      throw new Error('api');
    },
    async iniciar(){
      this.error='';
      const mail=(this.email||'').toLowerCase().trim();
      if(!mail.endsWith('@ucema.edu.ar')){ this.error='No se pudo iniciar sesión.'; return; }
      if(!this.password){ this.error='No se pudo iniciar sesión.'; return; }
      this.cargando=true;
      try{
        const base = await this.detectarAPI();
        localStorage.setItem('ue_api', base);
        const r = await axios.post(base+'/login',{ email:mail, password:this.password, uni:this.uni.toLowerCase() });
        if(r.data && r.data.ok){
          localStorage.setItem('ue_user', JSON.stringify(r.data.user));
          window.location='menu.html?uni='+this.uni.toLowerCase();
          return;
        }
        this.error='No se pudo iniciar sesión.';
      }catch(e){
        this.error='No se pudo iniciar sesión.';
      }finally{ this.cargando=false; }
    }
  }
});


