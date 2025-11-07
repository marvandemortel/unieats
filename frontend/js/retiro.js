/* retiro.js - elige franja y confirma → confirmación */
function param(n){ return new URL(location.href).searchParams.get(n); }
function apiBase(){ return localStorage.getItem('ue_api') || 'http://127.0.0.1:4000'; }

function genHoras(){
  const out=[], pad=n=>String(n).padStart(2,'0');
  for(let h=10; h<=20; h++){
    for(let m of [0,15,30,45]){
      if(h===20 && m>0) break;
      out.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return out;
}

new Vue({
  el:'#app',
  data:{
    base: apiBase(),
    uni:(param('uni')||'ucema'),
    pedido:param('pedido')||'',
    horarios:genHoras(),
    hora:'',
    error:''
  },
  methods:{
    async confirmar(){
      try{
        await axios.put(this.base+'/api/pedidos/'+this.pedido,{hora:this.hora, estado:'pendiente'});
        window.location='confirmacion.html?pedido='+this.pedido;
      }catch(e){
        this.error='No se pudo confirmar la hora.';
      }
    }
  }
});


