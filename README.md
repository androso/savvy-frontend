# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### 1. Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```
### 2. Install dependencies

```sh 
pnpm install
```
### 3. Set Up Environment Variables
Create a .env file in the root directory and add your google client id:

```sh
VITE_GOOGLE_CLIENT_ID=id
```

### 4. Running dev environment
```sh
pnpm dev
```