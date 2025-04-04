const UserService = require("../services/user.service");

class UserController {
  static async registerUser(req, res) {
    try {
      console.log("recebendo a requisição", req.body)
      const { name, email, password, confirmPassword } = req.body;
      
      //verify if password and confirmation password matchated
      if(password!=confirmPassword){
        return res.status(400).json({message: "Passwords do not match"})
      }

      //call the UserSerce that create a user in database
      const user = await UserService.createUser(name, email, password, confirmPassword);

      res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
      res.status(400).json({ message: "Error registering user", error });
    }
  }
  
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const token = await UserService.authenticateUser(email, password);

      res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = UserController;
