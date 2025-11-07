// Muestra el detalle del pedido y permite refrescarlo
function param(n){ return new URL(location.href).searchParams.get(n); }
function apiBase(){ return localStorage.getItem('ue_api') || 'http://127.0.0.1:4000'; }

new Vue({
  el:'#app',
  data:{
    base: apiBase(),
    pedido: { items: [] },
    productos: [],
    error: ''
  },
  created(){
    axios.get(this.base + '/api/productos')
      .then(r => this.productos = r.data || []);
    this.recargar();
  },
  methods:{
    recargar(){
      const id = param('pedido');
      axios.get(this.base + '/api/pedidos/' + id)
        .then(r => this.pedido = r.data)
        .catch(() => this.error = 'No se pudo cargar el pedido');
    },
    nombreDe(id){
      const p = this.productos.find(x => x.id === id);
      return p ? p.nombre : ('#' + id);
    }
  }
});


