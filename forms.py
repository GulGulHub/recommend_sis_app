from wtforms import StringField, SubmitField, HiddenField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf import FlaskForm

class RegistrationForm(FlaskForm):
    fullname = StringField(
        'Full Name',
        validators=
            [DataRequired(),
            Length(min=2, max=200)
        ]
    )

    username = StringField(
        'Username / Display Name',
        validators=
            [DataRequired(),
            Length(min=2, max=20)
        ]
    )

    email = StringField(
        'Email',
        validators=[
            DataRequired(),
            Email()
        ]
    )

    password = PasswordField(
        'Password',
        validators=[
            DataRequired()
        ]
    )

    confirm_password = PasswordField(
        'Confirm Password',
        validators=[
            DataRequired(),
            EqualTo('password')
        ]
    )

    submit = SubmitField('Sign up')

class LoginForm(FlaskForm):
    username = StringField(
        'Username / Display Name',
        validators=[
            DataRequired()
        ]
    )

    password = PasswordField(
        'Password',
        validators=[
            DataRequired()
        ]
    )

    remember = BooleanField('Remember me')

    submit = SubmitField('Login')



class RecommendSisterForm(FlaskForm):
    fullname = StringField(
        'Full Name',
        validators=
        [DataRequired(),
         Length(min=2, max=200)
         ]
    )

    description = StringField(
        'Tag / Service / Buisness-Type',
        validators=
        [DataRequired(),
         Length(min=2, max=20)
         ]
    )

    contact = StringField(
        'Contact Information',
        validators=[
            DataRequired(),
            Length(min=2, max=20)
        ]
    )

    address = StringField(
        'Address if available',
        validators=[
            DataRequired(),
            Length(min=2, max=100)
        ]
    )

    submit = SubmitField('Recommend')


# class NewLocationForm(FlaskForm):
#     description = StringField('Location description',
#                            validators=[DataRequired(), Length(min=1, max=80)])
#     lookup_address = StringField('Search address')
#
#     coord_latitude = HiddenField('Latitude',validators=[DataRequired()])
#
#     coord_longitude = HiddenField('Longitude', validators=[DataRequired()])
#
#     submit = SubmitField('Create Location')

class FindForm(FlaskForm):

    search_description = StringField(
        'Search for Service or Buisness. See choices above',
        validators=
        [DataRequired(),
         Length(min=2, max=200)
         ]
    )
    submit = SubmitField('Find')

