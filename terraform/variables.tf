variable "aws_region" {
  description = "The AWS region to deploy resources in."
  default     = "ca-central-1"
}

variable "app_name" {
  description = "The name of the ECS application."
  default     = "my-ecs-app"
}
