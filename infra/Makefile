.PHONY: build-all transaction-service account-service api-gateway frontend

build-all:
	docker buildx bake -f docker-bake.hcl --allow=fs.read=../apps

transaction-service:
	docker buildx bake --allow=fs.read=../apps/frontend transaction-service

account-service:
	docker buildx bake --allow=fs.read=../apps/frontend account-service

api-gateway:
	docker buildx bake --allow=fs.read=../apps/frontend api-gateway

frontend:
	docker buildx bake --allow=fs.read=../apps/frontend frontend
