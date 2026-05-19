import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Inject loaded env variables into process.env so the local API functions can access them
  process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || '';
  process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || '';
  process.env.FIREBASE_API_KEY = env.FIREBASE_API_KEY || '';

  const localApiPlugin = () => ({
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = urlObj.pathname;

        if (pathname === '/api/razorpay' || pathname === '/api/forgot-password') {
          try {
            let handlerModule;
            if (pathname === '/api/razorpay') {
              handlerModule = await import('./api/razorpay.js');
            } else {
              handlerModule = await import('./api/forgot-password.js');
            }

            const handler = handlerModule.default;

            req.query = Object.fromEntries(urlObj.searchParams.entries());

            let bodyStr = '';
            req.on('data', chunk => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              try {
                req.body = bodyStr ? JSON.parse(bodyStr) : {};
              } catch (e) {
                req.body = {};
              }

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              try {
                await handler(req, res);
              } catch (handlerErr) {
                console.error(`Error in local handler for ${pathname}:`, handlerErr);
                res.status(500).json({ success: false, message: handlerErr.message });
              }
            });
          } catch (importErr) {
            console.error(`Failed to import local handler for ${pathname}:`, importErr);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: importErr.message }));
          }
          return;
        }
        next();
      });
    }
  });

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Fallback proxy if needed
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
