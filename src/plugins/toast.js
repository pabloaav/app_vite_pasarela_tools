import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 3500,
  position: { x: "right", y: "top" },
  types: [{ type: "warning", background: "orange" }],
  dismissible: true,
});

export default notyf;
