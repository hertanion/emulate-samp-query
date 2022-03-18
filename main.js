import dgram from "dgram";
import { Buffer } from "buffer";

// Opcode handlers
import onServerInfo from "./handlers/srvInfoHandler.js";
import onRuleInfo from "./handlers/ruleInfoHandler.js";
import onPlayerInfo from "./handlers/playerInfoHandler.js";

const MESSAGE_LOG = true;
const SERVER_PORT = 7777;

const server = dgram.createSocket("udp4");

// Error handler
server.on("error", (err) => {
    console.log(`[Server] Error:\n${err}`);
    server.close();
})

// Packets handler
server.on("message", async (msg, info) => {
    let bytesOffset = 0;
    const data = Buffer.from(msg);

    const samp_prefix = data.slice(bytesOffset, bytesOffset += 4).toString();
    if (samp_prefix === "SAMP") {
        bytesOffset += 6;
        const opcode = data.slice(bytesOffset, bytesOffset += 1).toString();
        if (opcode === "p") {
            server.send(data, 0, data.length, info.port, info.address);
        }
        await packetSender('127.0.0.1', SERVER_PORT, opcode, info.address, info.port);
        if (MESSAGE_LOG) console.log(`[Server] Incoming query packet: ${opcode}`);
    } else {
        if (MESSAGE_LOG) console.log("[Server] Not SAMP Packet!")
    }
})

server.on("listening", () => {
    const address = server.address();
    console.log(`[Server] Listening port ${address.port}`);
})

async function packetSender(host, port, opcode, d_ip, d_port) {
    const buf_size = 200;
    const buf = Buffer.alloc(buf_size);
    buf.write('SAMP');
    for(let i = 0; i < 4; i++) {
        buf[i + 4] = host.split('.')[i];
    };
    buf[8] = port & 0xFF;
    buf[9] = port >> 8 & 0xFF;
    buf[10] = opcode.charCodeAt(0);
    switch (opcode) {
        // Server information
        case "i": {
            const data = await onServerInfo(buf);
            server.send(data, 0, data.length, d_port, d_ip);
            break;
        }
        // Server rules
        case "r": {
            const data = await onRuleInfo(buf);
            server.send(data, 0, data.length, d_port, d_ip);
            break;
        }
        // Player list (rewrite player count in "i" opcode)
        case "c": {
            const data = await onPlayerInfo(buf);
            //server.send(data, 0, data.length, d_port, d_ip);
            break;
        }
    }
}

server.bind(SERVER_PORT);