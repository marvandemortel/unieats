// Confirma pedido (POST /api/pedidos) y redirige a pago
const API = localStorage.getItem('ue_api') || 'http://127.0.0.1:4000';

new Vue({
  el:'#app',
  data:()=>({items:[],hora:'',enviando:false,error:'',horas:[]}),
  computed:{ total(){ return this.items.reduce((a,it)=>a+(it.precio*it.cantidad),0); } },
  created(){
    this.items = JSON.parse(localStorage.getItem('ue_cart')||'[]');
    this.horas = this.genHoras();
    this.hora = this.horas[0] || '';
  },
  methods:{
    genHoras(){
      const out=[], pad=n=>String(n).padStart(2,'0');
      for(let h=10; h<=20; h++){ for(let m of [0,15,30,45]){ if(h===20&&m>0) break; out.push(`${pad(h)}:${pad(m)}`); } }
      return out;
    },
    persistir(){ localStorage.setItem('ue_cart', JSON.stringify(this.items)); },
    mas(it){ it.cantidad++; this.persistir(); },
    menos(it){ it.cantidad=Math.max(1, it.cantidad-1); this.persistir(); },
    confirmar(){
      this.error=''; 
      const user = JSON.parse(localStorage.getItem('ue_user')||'{}');
      if(!user.email){ location.href='inicio.html'; return; }
      if(!this.hora){ this.error='Elegí la hora de retiro'; return; }
      if(!this.items.length){ this.error='Carrito vacío'; return; }
      this.enviando=true;
      const payload = {
        email: user.email,
        uni: (user.uni||'UCEMA').toLowerCase(),
        hora: this.hora,
        items: this.items.map(it=>({id:it.id, cantidad:it.cantidad}))
      };
      axios.post(API+'/api/pedidos', payload)
        .then(r=>{
          localStorage.removeItem('ue_cart');
          localStorage.setItem('ue_last', String(r.data.id));
          location.href = 'pago.html?pedido='+r.data.id;
        })
        .catch(()=> this.error='No se pudo confirmar el pedido.')
        .finally(()=> this.enviando=false);
    }
  }
});
