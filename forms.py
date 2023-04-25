from wtforms import StringField, SubmitField, HiddenField, PasswordField, BooleanField, SelectField
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

    ############ go back to here ###############

    # description = StringField(
    #     'Tag / Service / Buisness-Type',
    #     validators=
    #     [DataRequired(),
    #      Length(min=2, max=20)
    #      ]
    # )

    ##### go back to here #################

    description = SelectField(
        'Tag / Service / Business-Type',
        choices=[('', 'Select an existing option')],  # Empty option for dropdown,
        validate_choice=False,
    )

    new_description = StringField(
        'New-Tag / Service / Business-Type',
        validators=[
            Length(max=20)
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

    # def validate(self, field):
    #     if not FlaskForm.validate(self):
    #         return False
    #     if field.description.data and field.new_description.data:
    #         field.description.errors.append('Please select an existing option or enter a new one.')
    #         field.new_description.errors.append('Please select an existing option or enter a new one.')
    #         return False

    #     return True




class FindForm(FlaskForm):

    search_description = StringField(
        'Search for Service or Buisness. See choices above',
        validators=
        [DataRequired(),
         Length(min=2, max=200)
         ]
    )
    submit = SubmitField('Find')


class CreateTokenForm(FlaskForm):

    submit = SubmitField('create Token')