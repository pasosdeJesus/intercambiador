# README

This backend manages the database for Intercambiador COP - TON.

## Requirements

* Ruby 3.2
* PostgreSQL 15.1

## Procedure to run backend in development mode (without TLS)

Install PostgreSQL and from its user in the operating system 
(e.g. `_postgresql` in adJ/OpenBSD) create a PostgreSQL superuser 
(let's say `copton`) that will create and operate the database.
From adJ/OpenBSD it would be:

       $ createuser -Upostgres -h /var/www/var/run/postgresql -s copton
       $ psql -Upostgres -h /var/www/var/run/postgresql/
       psql (15.1)
       Type "help" for help.
       postgres=# ALTER USER copton WITH PASSWORD 'nuevaclave';
       postgres=# \q


From the account that you will run the backend create a file `~/.pgpass` with
the password, for easier usage:

      echo "*:*:*:copton:nuevaclave" >> ~/.pgpass
      chmod 0600 ~/.pgpass

And create the development database (e.g `copton_des`) with:

      createdb -h /var/www/var/run/postgresql -U copton copton_des

From the directoy of the backend install gems with:

      bundle

Edith the file `../.env` and change the variable BD_CLAVE to set the
password for the postgresql user, if as username you use something 
different to `copton` set it in `BD_USUARIO`, and if the database you
created is differnte to `copton_des` set it in `BD_DES`.

Make a link to `../.env` with
      ln -s ../.env .

And install globally the gems `dotenv` and  `foreman`, on adJ/OpenBSD it 
would be `doas gem install dotenv foreman`

Test trying to start an interactive session with:
        HS256_SECRET=x bin/rails dbconsole

Once it works exit and recreate the database with its sctructure and
initial data with:
        HS256_SECRET=x bin/rails db:drop db:create db:setup db:migrate db:seed msip:indices

And test that it runs
        HS256_SECRET=x R=f bin/corre 

The value for HS256_SECRET is better chosen as `../bin/run.sh`  does.


## Tests

Run  `bein/rails test`


## Proxy to see development backend with TLS

You can use nginx to create a proxy that will serve the development backend 
with TLS.

If your development backend is running in port 3442 and you want to 
create the proxy in port 3443 with the name intercambiadordev.pasosdeJesus.org,
create a TLS certificate (let's say `/etc/ssl/serv.crt` and
`/etc/ssl/private/serv.key` with the domain name and add a section like this 
to your `/etc/nginx/nginx.conf`:
```
    server {
        listen      3443 ssl;
        listen       [::]:3443 ssl;
        server_name  intercambiadordev.pasosdeJesus.org;
        error_log  logs/intercambiadordev-serv.pasosdeJesus.org-error.log;
        access_log  logs/intercambiadordev-serv.pasosdeJesus.org-access.log;

        ssl_certificate      /etc/ssl/serv.crt;
        ssl_certificate_key  /etc/ssl/private/serv.key;

        location / {
            proxy_pass http://127.0.0.1:3442;
            proxy_redirect off;

            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

    }
```

