// filename: delete-all-records.ts

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function main() {
  const tableNames = ['user', 'product']; // Adicione os nomes das suas tabelas aqui

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${tableName}\`;`);
    console.log(`Todos os registros da tabela ${tableName} foram apagados.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });