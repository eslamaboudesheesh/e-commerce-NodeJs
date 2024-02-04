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
  - create confirmation link "activate link with token"
  - send email
  - send response

  # Activate Account:

  1.  route:

  - GET /active_account/:token
  - validation middleware to validate all data from user
  - next to controller

  2. controller :

  - token from requester
  - check user existence from token
  - update isConfirmed
  - create cart for user
  - send response

  # Login:

  1.  route:

  - Post /login
  - validation middleware to validate all data from user
  - next to controller

  2. controller :

  - data from requester
  - check user existence
  - check isConfirmed
  - check password
  - generate token
  - save token in token model schema
  - send response with success

  # send forgetCode:

  1.  route:

  - patch /forgetCode
  - validation middleware to validate all data from user
  - next to controller

  2. controller :

  - data from requester
  - check user existence
  - generate forget code
  - save it to user
  - send email
  - send response with success

# Reset Password:

1.  route:

- patch /resetPassword
- validation middleware to validate all data from user
- next to controller

2. controller :

- data from requester
- check user existence
- check forget code
- delete forget
- hash password
- save it to user
- find all token
- invalid all token
- send response with success
