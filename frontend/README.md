This is based on a mixture between 
<https://github.com/ton-connect/demo-dapp-with-backend> and 
<https://github.com/ton-community/twa-template>

Prepare with

       yarn

Start the development server with

       yarn dev --host --debug

If you prefer to prepare production files run

       yarn build

That will leave production files in the directory `dist`

To copy from directory dist to the directory specified in variable
`FRONTEND_DIR` of the file `../.env` use:

        make deploy

Configure nginx to serve over https either the production build
deployed or the development server.

* Production build deployed:
    ```
    server {
        listen      443 ssl;
        server_name  intercambiadordev.pasosdeJesus.org;
        ...
        root /htdocs/intercambiadordev/;
    }
    ```
* Development server but over TLS:
    ```
    server {
        listen      443 ssl;
        server_name  intercambiadordev.pasosdeJesus.org;
        ...

        location / {
            proxy_pass http://127.0.0.1:5173;
            proxy_redirect off;

            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Allow CORS requests
        add_header Access-Control-Allow-Origin *;
    }
    ```

You can test incrementally opening these URLs:

p.html  Statically served. Should show name of subdomain, tipically 
        intercambiadordev. 

f.html  Should create request to authentication backend to generate payload
        for TonProof.  If the authentication backend is running it should
        answer with something like:
        `{"payload":"xufo24rVj1OWpqV20Ze0yU93utSih44nDHHNzNTuDXo="}`


