// Carga menú (con ?uni y filtros) y permite agregar por click
const API = localStorage.getItem('ue_api') || 'http://127.0.0.1:4000';
const UE  = JSON.parse(localStorage.getItem('ue_user')||'{}');
const UNI = (UE.uni || 'UCEMA').toLowerCase();

new Vue({
  el:'#app',
  data:()=>({ productos:[], q:'', categoria:'', error:'' }),
  computed:{
    totalItems(){
      const c = JSON.parse(localStorage.getItem('ue_cart')||'[]');
      return c.reduce((a,it)=>a+Number(it.cantidad||1),0);
    }
  },
  created(){ this.cargar(); },
  methods:{
    cargar(){
      const params = { uni: UNI };
      if (this.q) params.q = this.q;
      if (this.categoria) params.categoria = this.categoria;
      axios.get(API+'/api/productos',{params})
           .then(r=> this.productos=r.data)
           .catch(()=> this.error='No se pudo cargar el menú. ¿Está encendido el backend?');
    },
    agregar(p){
      const cart = JSON.parse(localStorage.getItem('ue_cart')||'[]');
      const ya = cart.find(it=>it.id===p.id);
      ya ? ya.cantidad++ : cart.push({id:p.id, nombre:p.nombre, precio:p.precio, cantidad:1});
      localStorage.setItem('ue_cart', JSON.stringify(cart));
      this.$forceUpdate();
    },
    irCarrito(){ location.href='carrito.html'; }
  }
});

