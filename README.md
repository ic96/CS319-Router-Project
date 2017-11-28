[![Logo Image](https://www.uniserve.com/wp-content/uploads/2017/03/Uniserve-logo.png)](https://www.uniserve.com)

## Uniserve Project
This project extends the existing client portal, allowing customers to visualize their existing Uniserve network implementation(s) and see usage and trends in forms of tables and maps. The final product will be hosted on Uniserve’s cloud infrastructure and customers will access the new module via the existing ‘My Account’ solution.

## Requirements
* Python (ver. 2.7.13)
	* npm (3.10.8)
	* pip (9.0.1)
* React (ver. 15.6.1)
* Postgres (ver. 9.6.6) 
* Django (ver. 1.11.5)

Check the technical requirements document for a more in-depth requirements list.

External libraries and tools will be downloaded during the installation stage.
## Installation
1. Clone this git repo
1. Cd into the new directory
1. run `pip install virtualenv`
1. Then go `virtualenv env`
This will install and create the virtual environment for the server to run off of 
1. To go into virtualenv go `source ./env/bin/activate`
1. Now run `pip install -R requirements.txt`
1. cd into `./client`
1. run `npm install` then `npm run build`

## Config
In ping-crontab.py, modify the following line with the correct database name and credentials:
conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
Note: in this case, database name is ubc05, username is ubc05, password is UbC$5.

In consolidation-crontab.py, modify the following line with the correct database name and credentials:
conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
Note: in this case, database name is ubc05, username is ubc05, password is UbC$5.


In device-crontab.py, modify the following line with the correct database name and credentials:
conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
Note: in this case, database name is ubc05, username is ubc05, password is UbC$5.


In location.py, modify the following line with the correct database name and credentials:
conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
Note: in this case, database name is ubc05, username is ubc05, password is UbC$5.

* For the Django backend settings they can be found in `~/<project directory>/server/server/settings.py`
	* Here you will have to change the database connection information as well

* To configure the Django backend to integrate with Apache2 you can visit [Here](https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/modwsgi/) for more information.
* In the apache2 configuration file for the web server please add these tags to the conf file
``` 
WSGIPythonHome /path/to/project/env 
WSGIPythonPath /path/to/project/server/

WSGIDaemonProcess uniserve
WSGIProcessGroup uniserve

WSGIScriptAlias / /path-to-project/server/server/wsgi.py

Alias /static/ /path-to-project/client/build/static/

<Directory "/path-to-project/client/build/static/">
Require all granted
</Directory>

<Directory "/path-to-project/server/server">
<Files wsgi.py>
Require all granted
</Files>

``` 
