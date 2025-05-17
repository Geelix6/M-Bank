.PHONY: build-all reverse-proxy frontend api-gateway saga-orchestrator user-service gift-service transaction-service

build-all:
	docker buildx bake -f docker-bake.hcl --allow=fs.read=../apps

reverse-proxy:
	docker buildx bake --allow=fs.read=../apps/reverse-proxy reverse-proxy

frontend:
	docker buildx bake --allow=fs.read=../apps/frontend frontend

api-gateway:
	docker buildx bake --allow=fs.read=../apps/api-gateway api-gateway

saga-orchestrator:
	docker buildx bake --allow=fs.read=../apps/saga-orchestrator saga-orchestrator

user-service:
	docker buildx bake --allow=fs.read=../apps/user-service user-service

gift-service:
	docker buildx bake --allow=fs.read=../apps/gift-service gift-service

transaction-service:
	docker buildx bake --allow=fs.read=../apps/transacion-service transaction-service