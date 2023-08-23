# Recommend a Sist*A

Find and Recommend Businesses and Services for BIW&ast; oC and Migrant Women&ast; in Berlin.

using ArgGis the user can make recommendations and mark these on the map. 
The user can also search for recommendations and save them to their profile.
You can find it deployed at gulgul.pythonanywhere.com

what to consider if you want to use this code:
- create virtual inviorment and install all dependencies
- create your own Secret and API Key as env variable
- create your Database url 
- run db_drop_and_create_all() once to create database
when deploying it on Pythonanywhere and making changes:
- remember to remove the dot_env imports in the App.py and flask_bcrypt
- run and create the db



