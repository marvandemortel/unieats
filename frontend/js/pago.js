// PUT pago + paso a retiro
const API = localStorage.getItem('ue_api') || 'http://127.0.0.1:4000';
function param(n){ return new URL(location.href).searchParams.get(n); }

new Vue({
  el:'#app',
  data:()=>({ pedido:param('pedido')||'', metodo:'', error:'' }),
  methods:{
    continuar(){
      if(!this.metodo){ this.error='Elegí un método de pago'; return; }
      axios.put(API+'/api/pedidos/'+this.pedido,{pago:this.metodo, estado:'pendiente'})
        .then(()=> location.href='retiro.html?pedido='+this.pedido)
        .catch(()=> this.error='No se pudo registrar el pago.');
    }
  }
});

