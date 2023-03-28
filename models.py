import os
from flask_login import UserMixin
from datetime import datetime
from database_creator import db

from dotenv import load_dotenv   #for python-dotenv method



# this is my User class for adding Users to the app
class User(UserMixin, db.Model):
    __tablename__ = 'table_users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)  # i.e Hanna Barbera
    display_name = db.Column(db.String(20), unique=True, nullable=False)  # i.e hanna_25
    email = db.Column(db.String(120), unique=True, nullable=False)  # i.e hanna@hanna-barbera.com
    password = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first()

    def __repr__(self):
        return f"User({self.id}, '{self.display_name}', '{self.email}')"

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


@classmethod
def get_id(cls, user_id):
    return cls.query.filter_by(id=user_id).first()

class Sister(UserMixin, db.Model):
    __tablename__ = 'table_sisters'

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(200), nullable=False)  # i.e Hanna Barbera
    description = db.Column(db.String(20), nullable=False)  # architect, it, massage
    contact = db.Column(db.String(120), nullable=False)  # an email, webpage, phonenumber
    address = db.Column(db.String(100), nullable=False)  # an address in Berlin
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.filter_by(id=userid).first()
    
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

    def __repr__(self):
        return f"[{self.id}, '{self.fullname}', '{self.description}']"

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def get_by_tag(self, tag):
        return self.query.filter_by(description=tag).all()




