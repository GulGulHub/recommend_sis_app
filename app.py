from flask import Flask, render_template, redirect, url_for, request, flash, abort, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, login_manager
#from flask_cors import CORS
import traceback
from models import User, Sister
from forms import RegistrationForm, LoginForm, RecommendSisterForm
from sqlalchemy.exc import IntegrityError
import hashlib
from flask_sqlalchemy import SQLAlchemy
#from flaskext.mysql import MySQL
#from dotenv import load_dotenv   #for python-dotenv method                  #for python-dotenv method
import os
from database_creator import db, setup_db, db_drop_and_create_all
from dotenv import load_dotenv   #for python-dotenv method
load_dotenv()                    #for python-dotenv method

#from flask_cors import CORS


app = Flask(__name__)
with app.app_context():
    setup_db(app)
    db_drop_and_create_all()
 #   CORS(app)



MAP_KEY = os.environ.get('MAP_API_KEY', "MAP_API_Key is not loading?")



login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'


# different classmethods needed for classes and DB
@classmethod
def get_by_id(cls, user_id):
    return cls.query.filter_by(id=user_id).first()


@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)


# all the routes
@app.route('/', methods=['GET', 'POST'])
def start():
    return render_template('index.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # hash user password, create user and store it in database
        hashed_password = hashlib.md5(form.password.data.encode()).hexdigest()
        user = User(
            full_name=form.fullname.data,
            display_name=form.username.data,
            email=form.email.data,
            password=hashed_password)
        try:
            user.insert()
            flash(f'Account created for: {form.username.data}!', 'success')
            return redirect(url_for('home'))
        # what is this?
        except IntegrityError as e:
            flash(f'Could not register! The entered username or email might be already taken', 'danger')
            print('IntegrityError when trying to store new user')
            # db.session.rollback()

    return render_template('registration.html', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    # Sanity check: if the user is already authenticated then go back to home page
    # if current_user.is_authenticated:
    #   return redirect(url_for('home'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(display_name=form.username.data).first()
        hashed_input_password = hashlib.md5(form.password.data.encode()).hexdigest()
        if user and user.password == hashed_input_password:
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            flash(f'Welcome back {form.username.data}!')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check user name and password', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash(f'You have logged out!', 'success')
    return redirect(url_for('home'))


@app.route('/home', methods=['GET','POST'])
@login_required
def home():
    return render_template('home.html')


@app.route('/find', methods=['GET'])
#@login_required()
def find():
    return render_template("find.html", MAP_KEY=MAP_KEY)

@app.route("/recommend", methods=['GET', 'POST'])
#@login_required()
def recommend():
    form = RecommendSisterForm()
    if form.validate_on_submit():
        sister = Sister(
            fullname = form.fullname.data,
            description = form.description.data,
            contact = form.contact.data,
            address = form.address.data,
        )
        try:
            sister.insert()
            flash(f'Thank you for you recommendation.{form.fullname.data} has been added! ')
        except IntegrityError as e:
            flash(f'Could not register! The entered username or email might be already taken', 'danger')
            print('IntegrityError when trying to store new user')
        return redirect(url_for('recommend'))
    return render_template("recommend.html", form=form)



@app.route('/all', methods=['GET','POST'])
#@login_required
def show_all():
    all_sisters = Sister.query.all()
    return render_template("all.html", all_sisters = all_sisters)

@app.route('/testfind', methods=['GET','POST'])
#@login_required
def testfind():
    return render_template("testfind.html", MAP_KEY=MAP_KEY)

