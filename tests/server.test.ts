import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { createServer, Server as HttpServer } from 'http';

let httpServer: HttpServer;
let ioServer: Server;
let clientSocket: ClientSocket;

beforeAll((done) => {
  httpServer = createServer();
  ioServer = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  httpServer.listen(() => {
    const port = (httpServer.address() as any).port;
    clientSocket = Client(`http://localhost:${port}`);
    done();
  });
});

afterAll(() => {
  ioServer.close();
  clientSocket.close();
});

test('should communicate', (done) => {
  ioServer.on('connection', (serverSocket: ServerSocket) => {
    serverSocket.on('echo', (message: string, cb: Function) => {
      cb(message);
    });
  });

  clientSocket.on('connect', () => {
    clientSocket.emit('echo', 'hello world', (response: string) => {
      expect(response).toBe('hello world');
      done();
    });
  });
});
