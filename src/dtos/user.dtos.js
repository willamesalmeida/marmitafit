
/**
 * Creates a DTO (Data Transfer Object) for the user object
 * removing sensitive attributes such as the password.
 *
 * @param {Object} user - User object complete
 * @returns {Object} - Filtered User Object (DTO) with only essential data
 */

function userDTO (user) {
  return { id: user.id,
   name: user.name,
   email: user.email,
  isAdmin: user.isAdmin
}
 }

 module.exports = userDTO;