
all:
	yarn build

deploy:
	(. ../.env && cp -rfp dist/* $$FRONTEND_DIR)
	(. ../.env && for i in `find $$FRONTEND_DIR -exec grep -l intercambiador {} ';'`; do sed -i -e "s/intercambiador/$$RC/g" $$i; done)

