
🎤 Roger UI | Plataforma de Terapia de Fala Interativa

<div align="center">
  <img src="./public/roger-demo.gif" width="600" alt="Demonstração da interface do Roger UI com jogos terapêuticos">
</div>

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

✨ Visão Geral
Plataforma lúdica para auxiliar fonoaudiólogos no tratamento de distúrbios de fala, com:
- **Jogos interativos** baseados em fonética
- **Monitoramento em tempo real** do progresso
- **Interface acessível** para crianças

🚀 Tecnologias-Chave
```mermaid
pie
    title Stack Tecnológica
    "Vite" : 25
    "React 18" : 30
    "TypeScript" : 20
    "Tailwind CSS" : 15
    "Lucide Icons" : 10
```

🎮 Funcionalidades
| Módulo         | Tecnologia Usada       | Benefício Terapêutico          |
|----------------|------------------------|--------------------------------|
| Jogo da Memória Sonora | Web Audio API | Discriminação auditiva         |
| Repetição de Fonemas   | MediaRecorder API | Articulação de sons            |
| Progresso Visual       | Chart.js         | Motivação do paciente          |

 📁 Estrutura do Projeto
```bash
src/
├── assets/          # Audios e imagens terapêuticas
├── components/      # Componentes reutilizáveis
│   ├── therapy/     # Jogos especializados
│   └── progress/    # Componentes de acompanhamento
├── hooks/           # useAudioAnalyzer, useSpeechDetection
├── providers/       # Contextos de terapia
├── styles/          # Configurações do Tailwind
└── types/           # Tipos específicos para fonoaudiologia
```

## 🛠️ Configuração Rápida
```bash
# 1. Clone o repositório
git clone https://github.com/Pedro-Rcastro/roger-ui.git

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev
```

🎨 Design System
```ts
// Cores terapêuticas (tailwind.config.js)
theme: {
  extend: {
    colors: {
      speech: {
        primary: '#5D5FEF',
        secondary: '#A5B4FC',
        accent: '#FCD34D'
      }
    }
  }
}
```

📈 Próximas Features
- [ ] Integração com API de reconhecimento de voz
- [ ] Modo multiplayer para terapia em grupo
- [ ] Exportação de relatórios em PDF

👨‍⚕️ Casos de Uso
```tsx
// Exemplo: Componente de Jogo Terapêutico
interface TherapyGameProps {
  difficulty: 'Sílaba' | 'Palavra' | 'Frase';
  targetSound: PhonemeType;
}

export const ArticulationGame = ({ difficulty }: TherapyGameProps) => {
  const { playSound } = useAudioFeedback();
  return <button onClick={playSound}>Repetir Som</button>;
}
```

🌐 Acessibilidade
- Navegação por teclado
- Contraste WCAG AA
- Legendas para todos os sons

<div align="center">
  <a href="https://roger-ui.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/VERCEL-DEPLOY-black?style=for-the-badge&logo=vercel" alt="Deploy no Vercel">
  </a>
</div>

----

**Desenvolvido com ❤️ por [Pedro Castro](https://github.com/Pedro-Rcastro)**  
[![LinkedIn](https://img.shields.io/badge/CONECTE_SE_NO_LINKEDIN-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/pedro-castro-)
```


