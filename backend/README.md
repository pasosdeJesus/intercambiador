# README

This backend manages the database for Intercambiador COP - TON.

## Requirements

* Ruby 3.2
* PostgreSQL 15.1

## Procedure to run backend in development mode

Install PostgreSQL and from its user in the operating system 
(e.g. `_postgresql` in adJ/OpenBSD) create a PostgreSQL superuser that will
create and operate the database,
for example from adJ/OpenBSD:

       $ createuser -Upostgres -h /var/www/var/run/postgresql -s copton
       $ psql -Upostgres -h /var/www/var/run/postgresql/
       psql (15.1)
       Type "help" for help.
       postgres=# ALTER USER copton WITH PASSWORD 'nuevaclave';
       postgres=# \q


From the account that you will run the backend create a file `~/.pgpass` with
the password, for easier usage:

      echo "*:*:*:copton:nuevaclave" >> ~/.pgpass

And create the development database (e.g `copton_des`) with:

      createdb -h /var/www/var/run/postgresql -U copton copton_des

From the directoy of the backend install gems with:

      bundle

Edith the file `../.env` and change the variable BD_CLAVE to set the
password for the postgresql user, if as username you use something 
differente to copton set it in BD_USUARIO, and if the database you
created is diferente to copton_des set it in BD_DES.

Make a link to `../env` with
      ln -s ../.env .
And install globally the gem dotenv, on adJ/OpenBSD it would be
`doas gem install dotenv`

Test trying to start an interactive session with:
        HS256_SECRET=x bin/rails dbconsole

Once it works exit and recreate database with its sctructure and
initial data with:
        HS256_SECRET=x bin/rails db:drop db:create db:setup db:migrate db:seed msip:indices

        HS256_SECRET=x R=f bin/corre 


