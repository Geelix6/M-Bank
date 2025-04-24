.PHONY: build-all transaction-service account-service api-gateway frontend

build-all:
	docker buildx bake -f docker-bake.hcl --allow=fs.read=../apps

transaction-service:
	docker buildx bake --allow=fs.read=../apps/transaction-service transaction-service

account-service:
	docker buildx bake --allow=fs.read=../apps/account-service account-service

api-gateway:
	docker buildx bake --allow=fs.read=../apps/api-gateway api-gateway

frontend:
	docker buildx bake --allow=fs.read=../apps/frontend frontend

reverse-proxy:
	docker buildx bake --allow=fs.read=../apps/reverse-proxy reverse-proxy
