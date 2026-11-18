import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export async function startStudio() {
  const previous = process.cwd();
  process.chdir(fileURLToPath(new URL('.', import.meta.url)));
  let server;
  try {
    server = await createServer({ server: { port: 0 } });
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string')
      throw new Error('No se encontró el puerto de Vite');
    const url = `http://127.0.0.1:${address.port}`;
    return {
      url,
      async close() {
        try {
          await server.close();
        } finally {
          process.chdir(previous);
        }
      },
    };
  } catch (error) {
    try {
      await server?.close();
    } finally {
      process.chdir(previous);
    }
    throw error;
  }
}
