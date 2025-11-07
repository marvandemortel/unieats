// Ver estado + repetir (endpoint dedicado)
const API = localStorage.getItem('ue_api') || 'http://127.0.0.1:4000';
function param(n){ return new URL(location.href).searchParams.get(n); }

new Vue({
  el:'#app',
  data:()=>({ id: Number(param('id')||localStorage.getItem('ue_last')||0), pedido:{items:[]}, productos:[], error:'' }),
  created(){
    axios.get(API+'/api/productos').then(r=> this.productos=r.data);
    this.recargar();
  },
  methods:{
    recargar(){
      axios.get(API+'/api/pedidos/'+this.id)
        .then(r=> this.pedido=r.data)
        .catch(()=> this.error='No se pudo cargar el pedido');
    },
    nombreDe(id){ const p=this.productos.find(x=>x.id===id); return p? p.nombre : ('#'+id); },
    repetir(){
      axios.post(API+'/api/pedidos/repetir/'+this.id)
        .then(r=>{ localStorage.setItem('ue_last', String(r.data.id)); location.href='mi-pedido.html?id='+r.data.id; })
        .catch(()=> this.error='No se pudo repetir el pedido');
    }
  }
});

