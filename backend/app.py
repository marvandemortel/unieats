from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})

DB_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def _base_db():
    return {
        "productos": [
            {"id": 1,  "uni": "generic", "nombre": "Pebete", "precio": 2500, "categoria": "comida"},
            {"id": 2,  "uni": "generic", "nombre": "Tostado", "precio": 3200, "categoria": "comida"},
            {"id":10,  "uni": "generic", "nombre": "Ensalada César", "precio": 5200, "categoria": "comida"},
            {"id":11,  "uni": "generic", "nombre": "Ensalada mixta", "precio": 4500, "categoria": "comida"},
            {"id":12,  "uni": "generic", "nombre": "Empanada de carne", "precio": 1200, "categoria": "comida"},
            {"id":13,  "uni": "generic", "nombre": "Empanada jyq", "precio": 1200, "categoria": "comida"},
            {"id":14,  "uni": "generic", "nombre": "Wrap de pollo", "precio": 4800, "categoria": "comida"},
            {"id":15,  "uni": "generic", "nombre": "Wrap veggie", "precio": 4700, "categoria": "comida"},
            {"id":16,  "uni": "generic", "nombre": "Sándwich veggie", "precio": 4300, "categoria": "comida"},
            {"id":17,  "uni": "generic", "nombre": "Tarta jyq", "precio": 3900, "categoria": "comida"},
            {"id":18,  "uni": "generic", "nombre": "Tarta de verdura", "precio": 3800, "categoria": "comida"},
            {"id": 3,  "uni": "generic", "nombre": "Medialuna", "precio":  900, "categoria": "panificado"},
            {"id": 4,  "uni": "generic", "nombre": "Budín", "precio": 1800, "categoria": "panificado"},
            {"id":19,  "uni": "generic", "nombre": "Chipá (porción)", "precio": 1300, "categoria": "panificado"},
            {"id":20,  "uni": "generic", "nombre": "Alfajor", "precio": 1600, "categoria": "panificado"},
            {"id":21,  "uni": "generic", "nombre": "Muffin de chocolate", "precio": 1900, "categoria": "panificado"},
            {"id": 5,  "uni": "generic", "nombre": "Café chico", "precio": 1200, "categoria": "bebida"},
            {"id": 6,  "uni": "generic", "nombre": "Café grande", "precio": 1700, "categoria": "bebida"},
            {"id": 7,  "uni": "generic", "nombre": "Jugo de naranja", "precio": 2200, "categoria": "bebida"},
            {"id": 8,  "uni": "generic", "nombre": "Agua sin gas 500ml", "precio": 1200, "categoria": "bebida"},
            {"id": 9,  "uni": "generic", "nombre": "Gaseosa lata", "precio": 1800, "categoria": "bebida"},
            {"id":22,  "uni": "generic", "nombre": "Té en saquito", "precio": 1100, "categoria": "bebida"},
            {"id":23,  "uni": "generic", "nombre": "Submarino", "precio": 2400, "categoria": "bebida"},
            {"id":24,  "uni": "generic", "nombre": "Promo: Café chico + medialuna", "precio": 1900, "categoria": "promo"},
            {"id":25,  "uni": "generic", "nombre": "Promo: Sándwich + gaseosa", "precio": 4700, "categoria": "promo"},
            {"id":26,  "uni": "ucema",   "nombre": "Promo: Café chico + budín", "precio": 2800, "categoria": "promo"},
            {"id":27,  "uni": "ucema",   "nombre": "Promo: Ensalada + agua", "precio": 5900, "categoria": "promo"}
        ],
        "pedidos": [],
        "feedback": []
    }

def _leer_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(_base_db(), f, ensure_ascii=False, indent=2)
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def _guardar_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

def _sig_id(items):
    return (max(i["id"] for i in items) + 1) if items else 1

@app.route("/ping")
def ping():
    return jsonify({"ok": True})

# ---------- Login ----------
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True) or {}
        email = (data.get("email") or data.get("username") or "").strip().lower()
        password = str(data.get("password") or "").strip()
        uni = (data.get("uni") or "ucema").lower()

        if email.endswith("@ucema.edu.ar") and password:
            return jsonify({"ok": True, "user": {"email": email, "uni": uni}}), 200
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception:
        return jsonify({"error": "Formato inválido"}), 400

# ---------- Productos ----------
@app.route("/api/productos", methods=["GET"])
def listar_productos():
    db = _leer_db()
    categoria = (request.args.get("categoria") or "").lower().strip()
    q        = (request.args.get("q") or "").lower().strip()
    uni_q    = (request.args.get("uni") or "").lower().strip()

    prods = db["productos"]
    if uni_q:
        prods = [p for p in prods if p.get("uni","generic").lower() in (uni_q, "generic")]
    if categoria:
        prods = [p for p in prods if p["categoria"].lower() == categoria]
    if q:
        prods = [p for p in prods if q in p["nombre"].lower()]
    return jsonify(prods), 200

@app.route("/api/productos", methods=["POST"])
def crear_producto():
    db = _leer_db()
    data = request.get_json() or {}
    try:
        nombre = str(data["nombre"]).strip()
        precio = int(data["precio"])
        categoria = str(data["categoria"]).strip()
        uni = str(data.get("uni","generic")).strip().lower()
    except Exception:
        return jsonify({"error":"Datos inválidos"}), 400
    nuevo = {"id": _sig_id(db["productos"]), "uni": uni, "nombre": nombre, "precio": precio, "categoria": categoria}
    db["productos"].append(nuevo)
    _guardar_db(db)
    return jsonify(nuevo), 201

@app.route("/api/productos/<int:pid>", methods=["PUT"])
def actualizar_producto(pid):
    db = _leer_db()
    data = request.get_json() or {}
    for p in db["productos"]:
        if p["id"] == pid:
            p["nombre"] = str(data.get("nombre", p["nombre"])).strip()
            if "precio" in data:    p["precio"] = int(data["precio"])
            p["categoria"] = str(data.get("categoria", p["categoria"])).strip()
            if "uni" in data:       p["uni"] = str(data["uni"]).strip().lower()
            _guardar_db(db)
            return jsonify(p), 200
    return jsonify({"error":"Producto no encontrado"}), 404

@app.route("/api/productos/<int:pid>", methods=["DELETE"])
def borrar_producto(pid):
    db = _leer_db()
    antes = len(db["productos"])
    db["productos"] = [p for p in db["productos"] if p["id"] != pid]
    if len(db["productos"]) == antes:
        return jsonify({"error":"Producto no encontrado"}), 404
    _guardar_db(db)
    return jsonify({"ok": True}), 200

# ---------- Pedidos ----------
@app.route("/api/pedidos", methods=["GET"])
def listar_pedidos():
    db = _leer_db()
    estado = (request.args.get("estado") or "").strip().lower()
    desde  = (request.args.get("desde") or "").strip()
    pedidos = db["pedidos"]
    if estado:
        pedidos = [p for p in pedidos if (p.get("estado","")).lower() == estado]
    if desde:
        pedidos = [p for p in pedidos if (p.get("hora","")) >= desde]
    return jsonify(pedidos), 200

@app.route("/api/pedidos/<int:pid>", methods=["GET"])
def ver_pedido(pid):
    db = _leer_db()
    for p in db["pedidos"]:
        if p["id"] == pid:
            return jsonify(p), 200
    return jsonify({"error":"Pedido no encontrado"}), 404

@app.route("/api/pedidos", methods=["POST"])
def crear_pedido():
    db = _leer_db()
    data = request.get_json() or {}
    uni   = (data.get("uni") or "generic").lower()
    items = data.get("items") or []
    hora  = data.get("hora") or ""
    nuevo = {"id": _sig_id(db["pedidos"]), "uni": uni, "items": items, "hora": hora,
             "estado": "pendiente", "pago": "pendiente", "total": 0}
    precios = {p["id"]: p["precio"] for p in db["productos"]}
    nuevo["total"] = sum(precios.get(it.get("id"),0)*int(it.get("cantidad",1)) for it in items)
    db["pedidos"].append(nuevo)
    _guardar_db(db)
    return jsonify({"id": nuevo["id"]}), 201

@app.route("/api/pedidos/<int:pid>", methods=["PUT"])
def actualizar_pedido(pid):
    db = _leer_db()
    data = request.get_json() or {}
    for p in db["pedidos"]:
        if p["id"] == pid:
            if "hora" in data:        p["hora"]  = data["hora"]
            if "hora_retiro" in data: p["hora"]  = data["hora_retiro"]
            if "estado" in data:      p["estado"]= data["estado"]
            if "pago" in data:        p["pago"]  = data["pago"]
            if "items" in data:
                p["items"] = data["items"]
                precios = {x["id"]: x["precio"] for x in db["productos"]}
                p["total"] = sum(precios.get(it.get("id"),0)*int(it.get("cantidad",1)) for it in p["items"])
            _guardar_db(db)
            return jsonify(p), 200
    return jsonify({"error":"Pedido no encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=4000)


