terraform {
  backend "s3" {
    bucket = "spyder-tf"
    key    = "my-booking-app/terraform.tfstate"
    region = "ca-central-1"
  }
}
