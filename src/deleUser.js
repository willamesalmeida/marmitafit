// deleteUser.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUserByEmail(email) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { email }  // Certifique-se que o campo 'email' está configurado como único no schema.
    });
    console.log('Usuário deletado com sucesso:', deletedUser);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Substitua 'seu-email@example.com' pelo email do usuário que você deseja deletar.
deleteUserByEmail('willames.almeida.b@gmail.com');
