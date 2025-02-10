import 'clsx';

var TrainDirection = /* @__PURE__ */ ((TrainDirection2) => {
  TrainDirection2[TrainDirection2["Reverse"] = 0] = "Reverse";
  TrainDirection2[TrainDirection2["Forward"] = 1] = "Forward";
  return TrainDirection2;
})(TrainDirection || {});
class ClientTrain {
  // Train data
  uuid;
  address;
  name;
  connUUID;
  // Non-Saveable Data
  speed = 0;
  direction = 1;
  /* Forward */
  constructor(uuid, address, name, connUUID) {
    this.uuid = uuid;
    this.address = address;
    this.name = name;
    this.connUUID = connUUID;
  }
}

export { ClientTrain as C, TrainDirection as T };
//# sourceMappingURL=Train.svelte-B8RiRVnW.js.map
