import traceback
import os
import random
from flask import Flask, render_template, redirect, url_for, request, flash, abort, jsonify, make_response

from flask_login import LoginManager, login_user, logout_user, login_required, current_user, login_manager

from flask_cors import CORS
from flask_bcrypt import Bcrypt


from models import User, Sister, SavedSearches
from forms import RegistrationForm, LoginForm, RecommendSisterForm, FindForm, CreateTokenForm
from sqlalchemy.exc import IntegrityError
import hashlib

from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL

from database_creator import db, setup_db, db_drop_and_create_all
from dotenv import load_dotenv  # for python-dotenv method

load_dotenv()  # for python-dotenv method


app = Flask(__name__)
app.static_folder = 'static'
with app.app_context():
    bcrypt = Bcrypt(app)
    setup_db(app)
    db_drop_and_create_all()
    CORS(app)


MAP_KEY = os.getenv('MAP_API_KEY', "MAP_API_Key is not loading?")


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
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        # hash user password, create user and store it in database
        # hashed_password = hashlib.md5(form.password.data.encode()).hexdigest()
        hashed_password = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
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
            flash(
                f'Could not register! The entered username or email might be already taken', 'danger')
            print('IntegrityError when trying to store new user')
            # db.session.rollback()

    return render_template('registration.html', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    # Sanity check: if the user is already authenticated then go back to home page
    # if current_user.is_authenticated:
    #   return redirect(url_for('home'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(display_name=form.username.data).first()
        # hashed_input_password = hashlib.md5(form.password.data.encode()).hexdigest()
        # if user and user.password == hashed_input_password:
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            flash(f'Login successful!')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check user name and password', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route('/findOutMore', methods=['GET', 'POST'])
def more():
    return render_template('more.html')


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash(f'!! You have logged out !!', 'success')
    return redirect(url_for('start'))


@app.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    return render_template('home.html')


@app.route("/recommend", methods=['GET', 'POST'])
@login_required
def recommend():
    form = RecommendSisterForm()
    if form.validate_on_submit():
        sister = Sister(
            fullname=form.fullname.data,
            description=form.description.data,
            contact=form.contact.data,
            address=form.address.data,
        )
        if form.new_description.data:
            sister.description = form.new_description.data

        try:
            sister.insert()
            flash(
                f'Thank you for your recommendation. {form.fullname.data} has been added!')

        except IntegrityError as e:
            flash(
                f'Could not register! The entered username or email might already be taken', 'danger')
            print('IntegrityError when trying to store new user')
        return redirect(url_for('recommend'))

    else:
        sisters = Sister.query.with_entities(Sister.description).all()
        if sisters:
            # Extract descriptions from the list of tuples
            double_descriptions = [sister[0] for sister in sisters]
        # Remove duplicates from the list
            descriptions = sorted(list(set(double_descriptions)))
            return render_template("recommend.html", form=form, sisters=descriptions)
    return render_template("recommend.html", form=form)


@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    user_id = current_user.id
    saved_search = Sister.query\
        .join(SavedSearches)\
        .filter(SavedSearches.user_id == user_id)\
        .all()
    if saved_search:
        return render_template("account.html", saved_search = saved_search)
    if request.method == ['Post']:
        if request.form.get('token') == 'create_token':
            token = random.randrange(100000, 1000000)  # randrange is exclusive at the stop
            return render_template("account.html", token = token, saved_search=saved_search)    
    else:
        return render_template("account.html")


@app.route('/all', methods=['GET', 'POST'])
@login_required
def show_all():
    all_sisters = Sister.query.all()
    return render_template("all.html", all_sisters=all_sisters)


@app.route('/find', methods=['GET', 'POST'])
@login_required
def find():
    form = FindForm()
    if form.validate_on_submit():
        search = form.search_description.data,
        find_query = Sister.query.filter_by(
            description=form.search_description.data).all()
        if find_query:
            flash(f"Yes, ,it worked!!!")
            sis_list = []
            for item in find_query:
                sis_list.append(item.address)
            return render_template("find.html", MAP_KEY=MAP_KEY, form=form, findData=find_query, db_address=sis_list)
        else:
            flash("no recommendation with that name found")
    return render_template("find.html", MAP_KEY=MAP_KEY, form=form)


@app.route('/api/getAddress', methods=['GET'])
def getAddress():
    tag = request.args.get('tag')
    if tag:
        sisters = Sister.query.filter_by(description=tag).all()
        if sisters:
            sisters_list = []
            for sister in sisters:
                new_sis = sister.to_dict()
                sisters_list.append(new_sis)
            return jsonify(sister=sisters_list), 200
        else:
            return jsonify(response=["Sorry, that Service/Buisness is not available"]), 404
    else:
        return jsonify(response=["Sorry, we could not compute your input, please try again"]), 404


@app.route('/api/getAll', methods=['GET'])
def get_all():
    sisters = Sister.query.all()
    if sisters:
        return jsonify(sisters=[sis.to_dict() for sis in sisters]), 200
    else:
        return jsonify(response=["Sorry, no Sisters in Database"]), 404


@app.route('/api/getDescriptions', methods=['GET'])
def get_description():
    sisters = Sister.query.with_entities(Sister.description).all()
    if sisters:
        # Extract descriptions from the list of tuples
        double_descriptions = [sister[0] for sister in sisters]
        # Remove duplicates from the list
        descriptions = sorted(list(set(double_descriptions)))
        return jsonify(sisters=descriptions), 200
    else:
        return jsonify(response=["Sorry, no Sisters in Database"]), 404


@app.route('/api/saveSearches', methods=['POST'])
@login_required
def savedSearches():
    data = request.get_json()
    print(data)
    print(type(data[0]['id']))
    for sis in data:
        savedSearch = SavedSearches(
            user_id=current_user.id,
            sister_id=sis['id'])
        savedSearch.insert()

    res = make_response(jsonify({"message": "Data received"}), 200)

    return res
