This sources are based on 
<https://github.com/ton-connect/demo-dapp-backend with> 
with minimal changes

# Compilation

You can follow the instructions of the `Dockerfile`.
On adJ/OpenBSD they would be:

        doas pkg_add go
        go mod download all
        go build -o tonproof github.com/tonkeeper/tonproof

Tha last two steps are also run with:

        make

# Running

Run with
        HS256_SECRET="replace_with_secure_secret_shared_with_db_backend"\
        TONAPI_TOKEN="your_tonapi_token" ./tonproof
