from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv   #for python-dotenv method


load_dotenv()                    #for python-dotenv method

db = SQLAlchemy()

'''
setup_db(app):
    binds a flask application and a SQLAlchemy service
'''
MY_SQL_KEY = os.getenv("MYSQL_KEY", "MYSQL Key is not loading?")
SUPER_SECRET_KEY = os.getenv("SECRET_KEY")


def setup_db(app):
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite3'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:{MY_SQL_KEY}@localhost/db_RecommendASister'
    app.config['SECRET_KEY'] = SUPER_SECRET_KEY
    db.app = app
    db.init_app(app)




'''
    drops the database tables and starts fresh
    can be used to initialize a clean database
'''
def db_drop_and_create_all():
    pass

    #db.drop_all()
    #db.create_all()

