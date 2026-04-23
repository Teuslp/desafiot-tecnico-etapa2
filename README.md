# Desafio Técnico - Etapa 2

Este projeto é uma plataforma de gerenciamento administrativo e catálogo de produtos desenvolvida com foco em modernização, usabilidade e robustez técnica.

## Stack

### Frontend
- **Next.js 14+**: App Router e Server Components.
- **Tailwind CSS**: Estilização responsiva e moderna.
- **UI-GovPE**: Biblioteca de componentes padrão do Governo de Pernambuco.
- **FontAwesome**: Iconografia profissional.
- **Axios**: Comunicação com a API.

### Backend
- **NestJS**: Framework Node.js progressivo para aplicações escaláveis.
- **Prisma ORM**: Gerenciamento de banco de dados com segurança de tipos.
- **PostgreSQL**: Banco de dados relacional robusto.
- **JWT & Passport**: Autenticação segura.
- **Swagger**: Documentação detalhada e interativa da API.

---

## Decisões Técnicas e Arquitetura

### UX/UI Mobile-First & Acessibilidade
O projeto utiliza um sistema de **Layout Adaptativo**. Em dispositivos móveis, as tabelas de dados são convertidas automaticamente em **Cards** de leitura vertical, eliminando o scroll horizontal. 

Para o gerenciamento de categorias, implementamos um componente de **Multi-select Dropdown com Chips**, que permite ao administrador vincular múltiplas categorias a um único produto (atendendo plenamente aos requisitos de negócio) de forma limpa, moderna e intuitiva.


## Acesso ao Sistema

Para testar as funcionalidades administrativas e o catálogo, utilize as credenciais padrão geradas pelo script de seed:

- **Usuário Admin**: `admin@admin.com`
- **Senha**: `admin123`

---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js v18+
- Docker & Docker Compose

### 1. Banco de Dados
Certifique-se de que o Docker esteja rodando e inicie o PostgreSQL:
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```
A API estará disponível em `http://localhost:3000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
O portal estará disponível em `http://localhost:3001` (ou 3000 se o backend não estiver rodando).

### 4. Rodando com Docker (Stack Completa)
Para subir o banco de dados, o backend e o frontend de uma única vez de forma automatizada:
```bash
docker-compose up --build
```
Após o build, o sistema estará disponível nos mesmos endereços (`:3000` para API e `:3001` para Portal).


---

## Documentação da API
A documentação interativa via Swagger pode ser acessada (após iniciar o backend) em:
`http://localhost:3000/api/docs`
