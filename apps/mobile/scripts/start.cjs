const os = require('node:os');
const { spawn } = require('node:child_process');
const net = require('node:net');
const http = require('node:http');
const path = require('node:path');

const interfaces = Object.values(os.networkInterfaces()).flatMap((entries) => entries ?? []);
const addresses = interfaces
  .filter((entry) => entry.family === 'IPv4' && !entry.internal)
  .map((entry) => entry.address)
  .filter((address) => !address.startsWith('169.254.'));
const hostAddress =
  addresses.find((address) => address.startsWith('192.168.')) ??
  addresses.find((address) => address.startsWith('10.')) ??
  addresses.find((address) => {
    const firstTwo = address.split('.').slice(0, 2).map(Number);
    return firstTwo[0] === 172 && firstTwo[1] >= 16 && firstTwo[1] <= 31;
  }) ??
  addresses[0];

const env = { ...process.env };
if (!env.EXPO_PUBLIC_API_URL && hostAddress) {
  env.EXPO_PUBLIC_API_URL = `http://${hostAddress}:${env.WMS_API_PORT || 4000}/api`;
}

if (!env.EXPO_PUBLIC_API_URL) {
  console.warn('Could not detect a LAN IP. Set EXPO_PUBLIC_API_URL to the computer IP for a physical phone.');
} else {
  console.log(`Mobile API: ${env.EXPO_PUBLIC_API_URL}`);
}

const expoCli = require.resolve('expo/bin/cli');
const printQRCode = require(path.resolve(
  path.dirname(expoCli),
  '../node_modules/@expo/cli/build/src/utils/qr.js',
)).printQRCode;
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '0.0.0.0', () => server.close(() => resolve(true)));
  });
}

async function start() {
  const preferredPort = Number(env.RCT_METRO_PORT || 8081);
  let port = preferredPort;
  while (port < preferredPort + 100 && !(await isPortAvailable(port))) port += 1;
  if (port >= preferredPort + 100) throw new Error('No free Expo port found in the next 100 ports.');
  if (port !== preferredPort) console.log(`Expo port ${preferredPort} is busy; using ${port}.`);

  const child = spawn(process.execPath, [expoCli, 'start', '--lan', '--clear', '--port', String(port), ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
  });

  // Expo suppresses its interactive QR display when launched through concurrently,
  // because stdout is piped. Print the same Expo Go QR once Metro is ready.
  if (!process.stdout.isTTY && hostAddress) {
    const metroUrl = `exp://${hostAddress}:${port}`;
    let stopped = false;
    child.once('exit', () => { stopped = true; });
    (async () => {
      for (let attempt = 0; attempt < 120 && !stopped; attempt += 1) {
        const ready = await new Promise((resolve) => {
          const request = http.get(`http://127.0.0.1:${port}/status`, (response) => {
            response.resume();
            resolve(response.statusCode >= 200 && response.statusCode < 500);
          });
          request.setTimeout(800, () => request.destroy());
          request.on('error', () => resolve(false));
        });
        if (ready) {
          console.log('\nScan this QR code with the iPhone Camera app to open in Expo Go:');
          console.log(`Expo Go: ${metroUrl}`);
          printQRCode(metroUrl).print();
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!stopped) console.warn('Metro did not become ready, so no Expo QR code was printed.');
    })().catch((error) => console.warn('Could not print Expo QR code:', error.message));
  }

  child.on('error', (error) => {
    console.error('Could not start Expo CLI:', error.message);
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
