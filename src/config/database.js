const {PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function testeConcection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful!!")
  } catch (error) {
    console.error("Error connecting to the database:", error)
    
  }
  
}

module.exports = testeConcection;