variable "aws_region" {
  description = "The AWS region to deploy resources in."
  default     = "ca-central-1"
}

variable "app_name" {
  description = "The name of the ECS application."
  default     = "my-ecs-app"
}

variable "MONGO_URL" {
    type = string
}

variable "JWT_SECRET" {
    type = string
}

variable "S3_ACCESS_KEY" {
    type = string
}

variable "S3_SECRET_ACCESS_KEY" {
    type = string
}

variable "HOST_URL" {
    type = string
}

variable "VITE_API_BASE_URL" {
    type = string
}
