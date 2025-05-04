.PHONY: build-all reverse-proxy frontend api-gateway user-service

build-all:
	docker buildx bake -f docker-bake.hcl --allow=fs.read=../apps

reverse-proxy:
	docker buildx bake --allow=fs.read=../apps/reverse-proxy reverse-proxy

frontend:
	docker buildx bake --allow=fs.read=../apps/frontend frontend

api-gateway:
	docker buildx bake --allow=fs.read=../apps/api-gateway api-gateway

user-service:
	docker buildx bake --allow=fs.read=../apps/user-service user-service