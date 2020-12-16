import axios from "axios";
import { authConfig, baseUrl, getLogger, withLogs } from "../core";
import { ItemProps } from "./ProductProps";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
const itemUrl = `http://${baseUrl}/api/product`;

export const getItems: (token: string) => Promise<ItemProps[]> = (token) => {
  var result = axios.get(itemUrl, authConfig(token));
  result.then(function (result) {
    result.data.forEach(async (item: ItemProps) => {
      await Storage.set({
        key: item._id!,
        value: JSON.stringify(item),
      });
    });
  });
  return withLogs(result, "getItems");
};

export const getItem: (token: string, id:string) => Promise<ItemProps> = (token,id) =>{
  var result= axios.get(`${itemUrl}/${id}`,authConfig(token))
  return withLogs(result, "getItem");
} 

export const createItem: (
  token: string,
  item: ItemProps
) => Promise<ItemProps> = (token, item) => {
  var result = axios.post(itemUrl, item, authConfig(token));
  result.then(async function (r) {
    var item = r.data;
    await Storage.set({
      key: item._id!,
      value: JSON.stringify(item),
    });
  });
  return withLogs(result, "createItem");
};
export const updateItem: (
  token: string,
  item: ItemProps
) => Promise<ItemProps> = (token, item) => {
  console.log("TOKEN: "+token);
  var result = axios.put(`${itemUrl}/${item._id}`, item, authConfig(token));
  result
    .then(async function (r) {
      var item = r.data;
      await Storage.set({
        key: item._id!,
        value: JSON.stringify(item),
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return withLogs(result, "updateItem");
};
export const eraseItem: (
  token: string,
  item: ItemProps
) => Promise<ItemProps[]> = (token, item) => {
  var result = axios.delete(`${itemUrl}/${item._id}`, authConfig(token));
  result.then(async function (r) {
    await Storage.remove({ key: item._id! });
  });
  return withLogs(result, "deleteItem");
};

interface MessageData {
  type: string;
  payload: ItemProps;
}

const log = getLogger("ws");

export const newWebSocket = (
  token: string,
  onMessage: (data: MessageData) => void
) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log("web socket onopen");
    ws.send(JSON.stringify({ type: "authorization", payload: { token } }));
  };
  ws.onclose = () => {
    log("web socket onclose");
  };
  ws.onerror = (error) => {
    log("web socket onerror", error);
  };
  ws.onmessage = (messageEvent) => {
    log("web socket onmessage");
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  };
};
