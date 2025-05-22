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
    "geelix6/reverse-proxy:latest",
    "geelix6/frontend:latest",
    "geelix6/api-gateway:latest",
    "geelix6/user-service:latest"
  ]
}

target "reverse-proxy" {
  context = "../apps/reverse-proxy"
  tags = ["geelix6/reverse-proxy:latest"]
}

target "frontend" {
  context = "../apps/frontend"
  tags = ["geelix6/frontend:latest"]
}

target "api-gateway" {
  context = "../apps/api-gateway"
  tags = ["geelix6/api-gateway:latest"]
}

target "saga-orchestrator" {
  context = "../apps/saga-orchestrator"
  tags = ["geelix6/saga-orchestrator:latest"]
}

target "user-service" {
  context = "../apps/user-service"
  tags = ["geelix6/user-service:latest"]
}

target "gift-service" {
  context = "../apps/gift-service"
  tags = ["geelix6/gift-service:latest"]
}

target "transaction-service" {
  context = "../apps/transaction-service"
  tags = ["geelix6/transaction-service:latest"]
}
