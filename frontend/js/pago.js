/* Muestra carrito + setea método de pago y pasa a retiro */
function param(n){ return new URL(location.href).searchParams.get(n); }
function apiBase(){ return localStorage.getItem('ue_api') || 'http://127.0.0.1:4000'; }

new Vue({
  el:'#app',
  data:{
    base: apiBase(),
    uni: (param('uni')||'ucema').toLowerCase(),
    pedido:param('pedido')||'',
    carrito:[],
    metodo:'',
    error:''
  },
  computed:{
    total(){ return this.carrito.reduce((a,b)=>a+(b.precio||0)*(b.cantidad||1),0); }
  },
  created(){
    this.carrito = JSON.parse(localStorage.getItem('carrito')||'[]');
  },
  methods:{
    async continuar(){
      try{
        await axios.put(this.base+'/api/pedidos/'+this.pedido,{pago:this.metodo, estado:'pendiente'});
        window.location='retiro.html?uni='+this.uni+'&pedido='+this.pedido;
      }catch(e){
        this.error='No se pudo registrar el pago.';
      }
    }
  }
});


