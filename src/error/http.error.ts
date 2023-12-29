export function httpErrorHandler(error: { syscall: string, code: string }) {
  if (error.syscall !== 'listen') throw error; // handeling only listen errors
  const bind = typeof process.env["PORT_HTTPS"] === 'string'
    ? 'Pipe ' + process.env["PORT_HTTPS"]
    : 'Port ' + process.env["PORT_HTTPS"];
  switch (error.code) { // handle errors properly
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
    default:
      console.error(error);
  }
  process.exit(1);
};