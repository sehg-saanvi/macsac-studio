import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { aiAgentMiddleware } from './server/aiAgentMiddleware.ts'

function aiAgentServerPlugin(): Plugin {
  return {
    name: 'macsac-ai-agent-server',
    configureServer(server) {
      server.middlewares.use('/api/ai-assistant', (req, res) => {
        aiAgentMiddleware(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai-assistant', (req, res) => {
        aiAgentMiddleware(req, res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aiAgentServerPlugin()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
