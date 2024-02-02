# app auth Module :

- The `auth` to handle login , signUp flow

  # Register:

  1.  route:

  - POST /register
  - validation middleware to validate all data from user
  - next to controller

  2. controller :

  - data from requester
  - check user existence
  - hash pass
  - generate token
  - create user
  - create confirmation link
  - send email
  - send response
