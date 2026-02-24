const {PrismaClient} = require('@prisma/client');

//The only instance of prisma client. This file is used to export the prisma client instance to be shared to all aplication services and controllers
//created to avoid multiple instances of prisma client in the application and to avoid connection issues with the database

const prisma = new PrismaClient();


module.exports = prisma;
