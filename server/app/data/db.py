import click
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from sqlalchemy.engine import URL
from flask import current_app
from flask import g


def get_db() -> Session:
    if "db" in g:
        return g.db
    config = current_app.config
    url = URL.create(
        drivername="postgresql",
        host=config["DB_HOST"],
        username=config["DB_USER"],
        password=config["DB_USER_PASS"],
        database=config["DB"],
    )
    engine = create_engine(url)
    session = Session(engine)
    g.db = session
    return g.db

def close_db(e=None):
    db: Session | None = g.pop("db", None)

    if db is not None:
        db.close_all()

def init_db():
    db = get_db()

    with current_app.open_resource("data/schema.sql") as f:
        db.execute(text(f.read().decode("utf8")))
        db.commit()
        
@click.command("init-db")
def init_db_command():
    init_db()
    click.echo("Initialized the database.")
