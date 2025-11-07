// Permite cambiar/confirmar hora y va a confirmación
const API = localStorage.getItem('ue_api') || 'http://127.0.0.1:4000';
function param(n){ return new URL(location.href).searchParams.get(n); }

new Vue({
  el:'#app',
  data:()=>({ pedido:param('pedido')||'', horarios:[], hora:'', error:'' }),
  created(){
    this.horarios = this.genHoras();
  },
  methods:{
    genHoras(){
      const out=[], pad=n=>String(n).padStart(2,'0');
      for(let h=10; h<=20; h++){ for(let m of [0,15,30,45]){ if(h===20&&m>0) break; out.push(`${pad(h)}:${pad(m)}`); } }
      return out;
    },
    confirmar(){
      axios.put(API+'/api/pedidos/'+this.pedido,{hora:this.hora, estado:'pendiente'})
        .then(()=> location.href='confirmacion.html?pedido='+this.pedido)
        .catch(()=> this.error='No se pudo confirmar la hora.');
    }
  }
});
