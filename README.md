# MarmitaFit API - Backend (Em Desenvolvimento)

Este repositório contém o ecossistema de backend da plataforma **MarmitaFit**, uma solução completa para gestão de pedidos e vendas de marmitas. O projeto encontra-se atualmente em fase ativa de desenvolvimento, focado na construção de uma arquitetura robusta, segura e escalável.

## 🚀 Sobre o Projeto

O MarmitaFit é uma aplicação proprietária projetada para gerir o fluxo completo de uma operação de marmitas. O desenvolvimento prioriza a integridade dos dados, a segurança na autenticação e a automação de processos logísticos, desde a gestão de estoque até o status final de entrega.

## 🛠 Stack Tecnológica

O projeto utiliza tecnologias de padrão industrial para garantir performance e facilidade de manutenção:

* **Ambiente:** Node.js com framework Express.
* **Persistência:** PostgreSQL integrado através do Prisma ORM.
* **Autenticação:** Sistema duplo de tokens (Access & Refresh Tokens) via JWT com controle de expiração.
* **Media:** Gestão de arquivos e processamento de imagens via Cloudinary API.
* **Comunicação:** Integração com SendGrid para notificações de sistema e recuperação de conta.
* **Segurança:** Implementação de camadas de *Rate Limiting* (limite de requisições) e *Slow Down* para proteção contra ataques de força bruta.



## 🏗 Estrutura Atual do Sistema

A API está organizada em camadas (Routes, Controllers, Services e Middlewares), com as seguintes funcionalidades já implementadas:

### 1. Núcleo de Autenticação e Usuários
* Fluxo de registro e login com encriptação de senhas via Bcrypt.
* Gestão de sessões ativas com revogação de tokens e suporte a múltiplos dispositivos (limite de 5 sessões).
* Perfil de usuário com upload dinâmico de fotos e gestão de endereços validados via Joi.

### 2. Gestão de Catálogo (Admin)
* Módulo administrativo para registro e remoção de produtos.
* Tratamento automático de arquivos: remoção de imagens na nuvem (Cloudinary) vinculada à exclusão de produtos no banco de dados.

### 3. Motor de Pedidos e Carrinho
* Lógica de carrinho de compras persistente por usuário.
* Sistema de checkout que converte itens do carrinho em pedidos vinculados a endereços específicos.
* **Máquina de Estados:** Controle rigoroso de status do pedido (PENDING, IN_PREPARATION, READY_FOR_DELIVERY, etc.), impedindo transições de status inválidas por meio de lógica de negócio no Service.

### 4. Validação e Infraestrutura
* Validação rigorosa de todos os inputs (Body e Params) via esquemas Joi.
* Middleware centralizado para tratamento de erros, garantindo respostas padronizadas em toda a API.

## 📈 Status do Desenvolvimento

O projeto está em **desenvolvimento ativo**. Atualmente, a base de segurança, integração com serviços de terceiros (Cloudinary/SendGrid) e a lógica principal de pedidos estão operacionais. As próximas etapas incluem o refinamento das regras de negócio e otimização das consultas ao banco de dados.

---

### 📄 Direitos e Propriedade

Este é um projeto privado e autoral. O código aqui exposto serve exclusivamente como demonstração de competências técnicas e portfólio de engenharia de software. Não é permitida a reprodução, distribuição, modificação ou utilização deste código para fins comerciais ou privados sem autorização expressa do autor.

**© 2026. Todos os direitos reservados.**
