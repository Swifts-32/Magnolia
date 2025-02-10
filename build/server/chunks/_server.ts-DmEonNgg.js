import { SerialPort } from 'serialport';

const GET = async () => {
  try {
    const ports = await SerialPort.list();
    return new Response(JSON.stringify({ message: ports }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to list serial ports" }), { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-DmEonNgg.js.map
