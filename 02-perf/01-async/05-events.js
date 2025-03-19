import { EventEmitter } from "node:events";

const ee = new EventEmitter();
ee.emit("connectionError", "");

ee.on("error", (error) => {
  console.error(error);
});
