const Players = [
    {name: "Kye", score: "1"},
    {name: "Spookie", score: "10"},
    {name: "Dorian_Gray", score: "228"},
    {name: "Sargon_Loud", score: "0"}
]

export default async function onPlayerInfo(buf) {
    let bytesOffset = 0;
    buf.writeInt16LE(Players.length, bytesOffset += 11);
    bytesOffset += 2;
    for (const k in Players) {
        buf.writeInt8(Players[k].name.length, bytesOffset); // Name length
        buf.write(Players[k].name, bytesOffset += 1); // Name
        buf.writeInt16LE(Players[k].score, bytesOffset += Players[k].name.length);
        bytesOffset += 4;
    }
    return buf;
}