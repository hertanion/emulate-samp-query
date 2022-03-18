const Rules = {
    lagcomp: "On",
    mapname: "Show",
    version: "0.3.7-R2",
    weather: "1",
    weburl: "",
    worldtime: "12:00"
}

export default async function onRuleInfo(buf) {
    let bytesOffset = 0;
    buf.writeInt16LE(Object.keys(Rules).length, bytesOffset += 11);
    bytesOffset += 2;
    for (const k in Rules) {
        buf.writeInt8(k.length, bytesOffset); // Rule size
        buf.write(k, bytesOffset += 1); // Rule name
        buf.writeInt8(Rules[k].length, bytesOffset += k.length); // Value size
        buf.write(Rules[k], bytesOffset += 1); // Size
        bytesOffset += Rules[k].length;
    }
    return buf;
}