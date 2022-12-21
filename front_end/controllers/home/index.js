import path from "path";

const home = {}

home.index = (req, res) => {
  return res.sendFile(path.join(__dirname, "../../build","index.html"));
}

export default home;