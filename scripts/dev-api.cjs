const { spawn } = require('node:child_process');
const net = require('node:net');

const port = Number(process.env.WMS_API_PORT || 4000);
const apiUrl = `http://127.0.0.1:${port}/api/health`;

function isPortInUse() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

async function start() {
  try {
    await fetch(apiUrl, { signal: AbortSignal.timeout(1500) });
    console.log(`API already responds on port ${port}; reusing it.`);
    return;
  } catch {
    if (await isPortInUse()) {
      console.warn(`Port ${port} is already occupied; reusing the existing service instead of starting a duplicate API.`);
      return;
    }
    // No API is responding and the port is free; start the workspace API below.
  }

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npm, ['run', 'dev', '-w', '@wms/api'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('error', (error) => {
    console.error('Could not start API:', error.message);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

start().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
