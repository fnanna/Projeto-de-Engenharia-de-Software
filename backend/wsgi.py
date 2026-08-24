from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text

from app.database import engine
from app.blueprints.projetos import projetos_bp
from app.blueprints.fases import fases_bp
from app.blueprints.tarefas import tarefas_bp

app = Flask(__name__)
CORS(app)  # libera acesso do frontend (React) rodando em outra origem/porta

app.register_blueprint(projetos_bp)
app.register_blueprint(fases_bp)
app.register_blueprint(tarefas_bp)


@app.get("/")
def raiz():
    return jsonify({"status": "ok", "message": "Backend rodando!"})


@app.get("/health/db")
def checar_banco():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return jsonify({"database": "connected"})
    except Exception as e:
        return jsonify({"database": "error", "detalhe": str(e)}), 500


if __name__ == "__main__":
    # útil para rodar localmente sem Docker: python wsgi.py
    app.run(host="0.0.0.0", port=8000, debug=True)
