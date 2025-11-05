from flask import Flask, request, jsonify

app = Flask(__name__)

@app.after_request
def add_cors_headers(resp):
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

@app.route('/api/<path:_>', methods=['OPTIONS'])
def cors_preflight(_):
    return ('', 204)

productos = [
    {"id": 1, "uni": "generic", "nombre": "Pebete",                "precio": 2500, "categoria": "comida"},
    {"id": 2, "uni": "generic", "nombre": "Tostado",               "precio": 3200, "categoria": "comida"},
    {"id":10, "uni": "generic", "nombre": "Ensalada César",        "precio": 5200, "categoria": "comida"},
    {"id":11, "uni": "generic", "nombre": "Ensalada mixta",        "precio": 4500, "categoria": "comida"},
    {"id":12, "uni": "generic", "nombre": "Empanada de carne",     "precio": 1200, "categoria": "comida"},
    {"id":13, "uni": "generic", "nombre": "Empanada jyq",          "precio": 1200, "categoria": "comida"},
    {"id":14, "uni": "generic", "nombre": "Wrap de pollo",         "precio": 4800, "categoria": "comida"},
    {"id":15, "uni": "generic", "nombre": "Wrap veggie",           "precio": 4700, "categoria": "comida"},
    {"id":16, "uni": "generic", "nombre": "Sándwich veggie",       "precio": 4300, "categoria": "comida"},
    {"id":17, "uni": "generic", "nombre": "Tarta jyq",             "precio": 3900, "categoria": "comida"},
    {"id":18, "uni": "generic", "nombre": "Tarta de verdura",      "precio": 3800, "categoria": "comida"},
    {"id": 3, "uni": "generic", "nombre": "Medialuna",             "precio":  900, "categoria": "panificado"},
    {"id": 4, "uni": "generic", "nombre": "Budín",                 "precio": 1800, "categoria": "panificado"},
    {"id":19, "uni": "generic", "nombre": "Chipá (porción)",       "precio": 1300, "categoria": "panificado"},
    {"id":20, "uni": "generic", "nombre": "Alfajor",               "precio": 1600, "categoria": "panificado"},
    {"id":21, "uni": "generic", "nombre": "Muffin de chocolate",   "precio": 1900, "categoria": "panificado"},
    {"id": 5, "uni": "generic", "nombre": "Café chico",            "precio": 1200, "categoria": "bebida"},
    {"id": 6, "uni": "generic", "nombre": "Café grande",           "precio": 1700, "categoria": "bebida"},
    {"id": 7, "uni": "generic", "nombre": "Jugo de naranja",       "precio": 2200, "categoria": "bebida"},
    {"id": 8, "uni": "generic", "nombre": "Agua sin gas 500ml",    "precio": 1200, "categoria": "bebida"},
    {"id": 9, "uni": "generic", "nombre": "Gaseosa lata",          "precio": 1800, "categoria": "bebida"},
    {"id":22, "uni": "generic", "nombre": "Té en saquito",         "precio": 1100, "categoria": "bebida"},
    {"id":23, "uni": "generic", "nombre": "Submarino",             "precio": 2400, "categoria": "bebida"},
    {"id":24, "uni": "generic", "nombre": "Promo: Café chico + medialuna", "precio": 1900, "categoria": "promo"},
    {"id":25, "uni": "generic", "nombre": "Promo: Sándwich + gaseosa",     "precio": 4700, "categoria": "promo"},
    {"id":26, "uni": "ucema",   "nombre": "Promo: Café chico + budín",     "precio": 2800, "categoria": "promo"},
    {"id":27, "uni": "ucema",   "nombre": "Promo: Ensalada + agua",        "precio": 5900, "categoria": "promo"}
]

pedidos = []
consultas = []
ultimo_id_pedido = 100

def filtrar_por_uni(lista, uni):
    if not uni: return lista
    return [x for x in lista if x.get("uni") in (uni, "generic")]

def buscar_producto(pid):
    for p in productos:
        if p["id"]==pid: return p
    return None

def buscar_pedido(pid):
    for p in pedidos:
        if p["id"]==pid: return p
    return None

@app.route('/api/productos', methods=['GET'])
def get_productos():
    uni = request.args.get('uni')
    categoria = request.args.get('categoria')
    q = (request.args.get('q') or '').lower()
    lista = filtrar_por_uni(productos, uni)
    if categoria: lista = [p for p in lista if p["categoria"]==categoria]
    if q: lista = [p for p in lista if q in p["nombre"].lower()]
    return jsonify(lista), 200

@app.route('/api/productos', methods=['POST'])
def post_producto():
    data = request.get_json() or {}
    if not all(k in data for k in ("nombre","precio","categoria","uni")):
        return jsonify({"error":"Faltan campos"}), 400
    new_id = max([p["id"] for p in productos]) + 1 if productos else 1
    nuevo = {"id":new_id, **data}
    productos.append(nuevo)
    return jsonify({"message":"Creado","producto":nuevo}), 201

@app.route('/api/productos/<int:pid>', methods=['PUT'])
def put_producto(pid):
    data = request.get_json() or {}
    prod = buscar_producto(pid)
    if not prod: return jsonify({"error":"No existe"}), 404
    for campo in ("nombre","precio","categoria","uni"):
        if campo in data: prod[campo] = data[campo]
    return jsonify({"message":"Actualizado","producto":prod}), 200

@app.route('/api/productos/<int:pid>', methods=['DELETE'])
def delete_producto(pid):
    global productos
    antes = len(productos)
    productos = [p for p in productos if p["id"]!=pid]
    if len(productos)==antes: return jsonify({"error":"No existe"}), 404
    return jsonify({"message":"Eliminado"}), 200

@app.route('/api/pedidos', methods=['POST'])
def post_pedido():
    global ultimo_id_pedido
    data = request.get_json() or {}
    uni = data.get("uni","generic")
    ultimo_id_pedido += 1
    nuevo = {"id": ultimo_id_pedido, "uni": uni, "items": [],
             "hora_retiro": None, "estado": "pendiente", "pago": "pendiente"}
    pedidos.append(nuevo)
    return jsonify({"message":"Pedido creado","pedido_id":nuevo["id"]}), 201

@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    uni = request.args.get('uni')
    estado = request.args.get('estado')
    desde = request.args.get('desde')
    lista = pedidos
    if uni:   lista = [p for p in lista if p["uni"]==uni]
    if estado:lista = [p for p in lista if p["estado"]==estado]
    if desde: lista = [p for p in lista if (p.get("hora_retiro") or "") >= desde]
    return jsonify(lista), 200

@app.route('/api/pedidos/<int:pid>', methods=['GET'])
def get_pedido(pid):
    p = buscar_pedido(pid)
    if not p: return jsonify({"error":"No existe"}), 404
    return jsonify(p), 200

@app.route('/api/pedidos/<int:pid>', methods=['PUT'])
def put_pedido(pid):
    p = buscar_pedido(pid)
    if not p: return jsonify({"error":"No existe"}), 404
    data = request.get_json() or {}

    if data.get("accion")=="agregar_item":
        producto_id = data.get("producto_id")
        try: cantidad = int(data.get("cantidad",1))
        except: return jsonify({"error":"cantidad inválida"}), 400
        if not buscar_producto(producto_id): return jsonify({"error":"producto_id inválido"}), 400
        enc=False
        for it in p["items"]:
            if it["producto_id"]==producto_id:
                it["cantidad"] += cantidad; enc=True; break
        if not enc: p["items"].append({"producto_id":producto_id,"cantidad":cantidad})

    if "estado" in data:      p["estado"] = data["estado"]
    if "pago" in data:        p["pago"] = data["pago"]
    if "hora_retiro" in data: p["hora_retiro"] = data["hora_retiro"]
    return jsonify({"message":"Actualizado","pedido":p}), 200

@app.route('/api/consultas', methods=['POST'])
def crear_consulta():
    data = request.get_json() or {}
    if 'nombre' in data and 'email' in data and 'mensaje' in data:
        consultas.append({"nombre":data['nombre'], "email":data['email'], "mensaje":data['mensaje']})
        return jsonify({"mensaje":"Consulta recibida con éxito"}), 200
    return jsonify({"error":"Faltan datos"}), 400

@app.route('/api/consultas', methods=['GET'])
def ver_consultas():
    return jsonify(consultas), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    if 'username' in data and 'password' in data:
        if str(data['password']).strip() != '':
            return jsonify({"mensaje":"Inicio de sesión exitoso"}), 200
        return jsonify({"error":"Credenciales incorrectas"}), 401
    return jsonify({"error":"Faltan datos"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=4000)
