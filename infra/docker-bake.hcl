group "default" {
  targets = ["transaction-service", "account-service", "api-gateway", "frontend", "reverse-proxy"]
  tags = [
    "ghcr.io/mbank/transaction-service:dev",
    "ghcr.io/mbank/account-service:dev",
    "ghcr.io/mbank/api-gateway:dev",
    "ghcr.io/mbank/frontend:dev",
    "ghcr.io/mbank/reverse-proxy:dev"
  ]
}

target "transaction-service" {
  context = "../apps/transaction-service"
  tags = ["ghcr.io/mbank/transaction-service:dev"]
}

target "account-service" {
  context = "../apps/account-service"
  tags = ["ghcr.io/mbank/account-service:dev"]
}

target "api-gateway" {
  context = "../apps/api-gateway"
  tags = ["ghcr.io/mbank/api-gateway:dev"]
}

target "frontend" {
  context = "../apps/frontend"
  tags = ["ghcr.io/mbank/frontend:dev"]
}

target "reverse-proxy" {
  context = "../apps/reverse-proxy"
  tags = ["ghcr.io/mbank/reverse-proxy:dev"]
}
