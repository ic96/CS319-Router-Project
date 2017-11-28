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

## Setting up the database

## Config
