group "default" {
  targets = [
    "reverse-proxy",
    "frontend",
    "api-gateway",
    "saga-orchestrator",
    "user-service",
    "gift-service",
    "transaction-service"
  ]
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

target "saga-orchestrator" {
  context = "../apps/saga-orchestrator"
  tags = ["ghcr.io/mbank/saga-orchestrator:dev"]
}

target "user-service" {
  context = "../apps/user-service"
  tags = ["ghcr.io/mbank/user-service:dev"]
}

target "gift-service" {
  context = "../apps/gift-service"
  tags = ["ghcr.io/mbank/gift-service:dev"]
}

target "transaction-service" {
  context = "../apps/transaction-service"
  tags = ["ghcr.io/mbank/transaction-service:dev"]
}
