group "default" {
  targets = ["reverse-proxy", "frontend", "api-gateway", "user-service"]
  tags = [
    "ghcr.io/mbank/reverse-proxy:dev",
    "ghcr.io/mbank/frontend:dev",
    "ghcr.io/mbank/api-gateway:dev",
    "ghcr.io/mbank/user-service:dev"
  ]
}

target "reverse-proxy" {
  context = "../apps/reverse-proxy"
  tags = ["ghcr.io/mbank/reverse-proxy:dev"]
}

target "frontend" {
  context = "../apps/frontend"
  tags = ["ghcr.io/mbank/frontend:dev"]
}

target "api-gateway" {
  context = "../apps/api-gateway"
  tags = ["ghcr.io/mbank/api-gateway:dev"]
}

target "user-service" {
  context = "../apps/user-service"
  tags = ["ghcr.io/mbank/user-service:dev"]
}
