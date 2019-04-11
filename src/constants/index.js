import superagent from "superagent";
let HOST = "https://ourlabels.org";
if (process.env.NODE_ENV === "development") {
  HOST = "http://localhost:59003";
}

export const agent = superagent.agent();
export const HOSTNAME = HOST;
