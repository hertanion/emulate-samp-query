const ServerSettings = {
    isPassword: 0,
    Players: 228,
    MaxPlayers: 1000,
    Hostname: "Hello world!",
    GameMode: "SAMP",
    Language: "JavaScript"
}

export default async function onServerInfo(buf) {
    let bytesOffset = 0;
    buf.writeInt8(ServerSettings.isPassword, bytesOffset += 11);
    buf.writeInt16LE(ServerSettings.Players, bytesOffset += 1); // 12
    buf.writeInt16LE(ServerSettings.MaxPlayers, bytesOffset += 2); // 14
    buf.writeInt16LE(ServerSettings.Hostname.length, bytesOffset += 2); // 16
    buf.write(ServerSettings.Hostname, bytesOffset += 4); // 20
    buf.writeInt16LE(ServerSettings.GameMode.length, bytesOffset += ServerSettings.Hostname.length);
    buf.write(ServerSettings.GameMode, bytesOffset += 4);
    buf.writeInt16LE(ServerSettings.Language.length, bytesOffset += ServerSettings.GameMode.length);
    buf.write(ServerSettings.Language, bytesOffset += 4);
    return buf;
}