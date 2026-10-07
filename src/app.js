import { createServer } from 'node:http';

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}
 
export function handleRequest(request, response) {
  if (request.method === 'GET' && request.url === '/') {
    sendJson(response, 200, {
      name: 'devops-training-starter',
      message: 'Сервис запущен',
    });
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  sendJson(response, 404, { error: 'Not found' });


}

export function createApp() {
  return createServer((request, response) => {
    const startTime = Date.now();
    response.on('finish', () => {
      const log = {
        timestamp: new Date().toISOString(),
        level: 'info',
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        durationMs: Date.now() - startTime,
      };
      console.log(JSON.stringify(log, null, 2));
    });
    
    handleRequest(request, response);
  });
}
