import os
from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DB="postgis-demo",
        DB_HOST="localhost",
        DB_USER="postgres",
        DB_USER_PASS="12345678"
    )
    if os.environ.get("ENV") == "prod":
        app.config["DB_HOST"] = "postgis"

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from .data import db
    app.teardown_appcontext(db.close_db)
    app.cli.add_command(db.init_db_command)


    from .controllers import markers

    app.register_blueprint(markers.bp)
    

    return app

def init_db():
    from .data import db
    db.init_db()