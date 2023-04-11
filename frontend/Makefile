
all:
	yarn build

deploy:
	(. ../.env && cp -rfp dist/* $$FRONTEND_DIR)
	(. ../.env && for i in `find $$FRONTEND_DIR -exec grep -l intercambiadordev {} ';'`; do sed -i -e "s/intercambiadordev/$$RC/g" $$i; done)

