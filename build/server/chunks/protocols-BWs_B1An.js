var ConnectionTypes = /* @__PURE__ */ ((ConnectionTypes2) => {
  ConnectionTypes2[ConnectionTypes2["Serial"] = 0] = "Serial";
  ConnectionTypes2[ConnectionTypes2["Wifi"] = 1] = "Wifi";
  ConnectionTypes2[ConnectionTypes2["Bluetooth"] = 3] = "Bluetooth";
  ConnectionTypes2[ConnectionTypes2["Zigbee"] = 4] = "Zigbee";
  ConnectionTypes2[ConnectionTypes2["Emulator"] = 5] = "Emulator";
  return ConnectionTypes2;
})(ConnectionTypes || {});
var ConnectionProtocols = /* @__PURE__ */ ((ConnectionProtocols2) => {
  ConnectionProtocols2[ConnectionProtocols2["DCCEX"] = 0] = "DCCEX";
  ConnectionProtocols2[ConnectionProtocols2["LCC"] = 1] = "LCC";
  return ConnectionProtocols2;
})(ConnectionProtocols || {});
function getProtocolName(protocol) {
  switch (protocol) {
    case 0:
      return "DCC EX";
    case 1:
      return "LCC";
    default:
      return "Unknown";
  }
}
function getConnectionTypeName(connType) {
  switch (connType) {
    case 0:
      return "Serial";
    case 1:
      return "Wifi";
    case 3:
      return "Bluetooth";
    case 4:
      return "Zigbee";
    case 5:
      return "Emulator";
    default:
      return "Unknown";
  }
}

export { ConnectionTypes as C, ConnectionProtocols as a, getConnectionTypeName as b, getProtocolName as g };
//# sourceMappingURL=protocols-BWs_B1An.js.map
