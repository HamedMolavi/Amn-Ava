import axios from "axios";
import { writeFileSync } from "fs";
import * as readline from 'readline';
import { io } from "socket.io-client";

//TODO: add more commands
let watchInterval: NodeJS.Timeout | undefined = undefined;
type Routes =  "chats" | "messages" | "contacts";
type User = { _id: string, firstName: string, lastName: string, username: string, password: string, email: string, createdAt: number };
type Chat = { _id: string, type: string, user1Id: string, user2Id: string, createdAt: number }
type Message = { _id: string, msg: string, chatId: Chat, senderId: User, sentAt: number }
const routes = ["chats", "messages", "contacts"];
type InfoType = {
  [key: string]: any
  "me": User | undefined
  "cookie": string | undefined
  "chats": { _id: string, type: string, user1Id: User, user2Id: User, createdAt: number }[]
  "contacts": { _id: string, ownerId: string, userId: User, createdAt: number }[]
  "messages": Message[]
  "chat": { _id: string, type: string, user1Id: User, user2Id: User, createdAt: number } | undefined
  "contact": { _id: string, ownerId: string, userId: User, createdAt: number } | undefined
}
var info: InfoType = {
  "me": undefined,
  "cookie": undefined,
  "chat": undefined,
  "contact": undefined,
  "chats": [],
  "contacts": [],
  "messages": []
};

let env: { "url": string | undefined, [key: string]: any } = {
  url: process.env["URL"],
}


async function act(action: string) {
  switch (true) { // explicit actions
    //------------------------------------------------------------------//
    case action == 'exit':
      console.log("EXITING!");
      process.exit(0);
    //------------------------------------------------------------------//
    case action == 'clear':
      console.clear();
      break;
    //------------------------------------------------------------------//
    case action == 'rs':
      break;
    //------------------------------------------------------------------//
    case action.startsWith("env"): {
      let name = action.split(" ").slice(1).at(-1);
      if (action.split(" ").includes('-i')) console.log((!!name && !name.startsWith("-")) ? info[name] : info);
      else console.log((!!name && !name.startsWith("-")) ? env[name] : env);
      break;
    }
    //------------------------------------------------------------------//
    case ["register", "login"].includes(action): {
      loadUser(action === "register");
      for (const fill of ['chats', 'contacts'] as Routes[]) {
        let list = await pgpd(fill, {
          param: fill === "contacts" ? info.me?._id
          // : fill === "messages" ? info.chats?._id
          : undefined,
          query: fill === "contacts" ? "populate[]=userId"
          : fill === "chats" ? "populate[]=user2Id&populate[]=user1Id"
          : undefined//"populate[]=chatId&populate[]=senderId"
        });
        info[fill] = list;
      }
      break;
    }
    //------------------------------------------------------------------//
    case action.startsWith("select"): {
      const selectWhat = action.split(" ").slice(1).at(-1) as Routes | undefined;
      if (!info.cookie) {
        console.log("Please login or register first!")
        break;
      } else if (!selectWhat || !routes.includes(selectWhat) || selectWhat === "messages") {
        console.log("Bad selection: ", selectWhat)
        break;
      }
      if (!info[selectWhat].length) {
        console.log(`No ${selectWhat}!`);
        break;
      };
        console.log(selectWhat, ":");
        for (const [index, item] of info[selectWhat].entries()) console.log(index.toString() + ".", printItem(item));
        let choosenIndex = await input(selectWhat).then(({ [selectWhat]: val }) => parseInt(val));
        let choosenItem = info[selectWhat][choosenIndex];
        info[selectWhat.slice(0,-1)] = choosenItem;
        if (selectWhat === "chats"){
          let fill: Routes = "messages";
          let list = await pgpd(fill, {
            param: info.chat?._id,
            query: undefined//"populate[]=chatId&populate[]=senderId"
          });
          info[fill] = list;
        };
        console.clear();
        console.log(selectWhat, "selected!");
      break;
    }
    //------------------------------------------------------------------//
    case action.startsWith("new"): {
      const createWhat = action.split(" ")?.[1] as Routes | undefined;
      const arg = action.split(" ")?.[2]?.trim();
      if (!info.cookie || !info.me?._id) {
        console.log("Please login or register first!");
        break;
      } else if (!createWhat || !["chats", "messages", "contacts"].includes(createWhat)) {
        console.log("Can't create ", createWhat);
        break;
      } else if (!arg && createWhat !== "chats") {
        console.log("Bad create argument: ", arg);
        break;
      } else if ((createWhat === "chats" && !info.contact?.userId?._id) || (createWhat === "messages" && !info.chat?._id)) {
        console.log("Bad create argument: ", arg);
        break;
      }
      let created = await pgpd(createWhat, {
        data: createWhat === "chats"
          ? { "user2Id": info.contact?.userId?._id }
          : createWhat === "messages"
            ? { "msg": arg, "chatId": info.chat?._id }
            : { username: arg }
      });
      if (createWhat !== "messages") info[createWhat] = created;
      else info.messages?.push(created as Message)
      break;
    }
    //------------------------------------------------------------------//
    case action === "chat": {
      if (!info.chat?._id) {
        console.log("Select a chat first!");
        break;
      }
      let that = [info.chat.user1Id, info.chat.user2Id].find((user) => user._id !== info.me?._id);
      console.log("Entring to chat with", that?.username);
      enableSocket();
      break;
    }
    //------------------------------------------------------------------//
    default:
      console.log(`Unknown command (${action})!`);
      console.log("List of commands:");
      console.log("\texit");
      console.log("\tclear");
      console.log("\trs");
      console.log("\tenv [name]");
      console.log("\tregister");
      break;
  };
};
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function setupInteractive(): Promise<(action: string) => Promise<void>> {
  // Setup Interactive stdin
  enableActions();
  //envs
  const askTheseKeys = Object.keys(env).reduce((res, cur) => { if (!env[cur]) res.push(cur); return res }, [] as string[]);
  Object.entries(await input(askTheseKeys)).forEach(([key, value]) => env[key] = value);
  console.clear();
  return act;
};

async function input(keys: Array<string> | string) {
  process.stdin.removeAllListeners("data");
  let results: { [key: string]: string } = {};
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  if (typeof keys === "string") keys = [keys];
  for (const key of keys) {
    await new Promise((resolve, _rej) => {
      rl.question(`${key.toUpperCase()}?\n`, (answer) => {
        results[key] = answer.trim();
        resolve(true);
      });
    })
  };
  rl.close();
  enableActions();
  return results;
};
function enableActions() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function hello(key: string) {
    act(key.trim());
  });
};

function printItem(item: any) {
  let printable = "";
  if (Object.keys(item).includes("userId")) printable = !!item.userId?.username ? item.userId?.username : item.userId
  if (Object.keys(item).includes("user1Id")) {
    let id1 = !!item.user1Id?._id ? item.user1Id?._id : item.user1Id
    if (id1 !== info.me?._id) printable = !!item.user1Id?._id ? item.user1Id?.username : item.user1Id;
    else printable = !!item.user2Id?._id ? item.user2Id?.username : item.user2Id;
  }

  return printable;
}

function printMessages() {

}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

async function loadUser(register: boolean = false) {
  const options = {
    method: 'POST',
    url: `http://${env.url}:4000/auth/${register ? "register" : "login"}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: register ? {
      ...await input(["username", "password", "email", "firstName", "lastName"])
    } : {
      ...await input(["username", "password"]),
      "is_remember": true
    }
  };
  return axios.request(options)
    .then(function (response) {
      info["cookie"] = response?.headers?.["set-cookie"]?.find((el) => el.startsWith("Bearer"))?.split(";")[0];
      info["me"] = response.data?.data;
      console.clear();
      console.log(register ? "Register" : "Login", " done!");
    })
    .catch((err) => console.error(err?.response?.status, err?.response?.statusText));
}

async function pgpd(what: Routes, options?: { data?: { [key: string]: any }, param?: string, query?: string }): Promise<Array<any> | any> {
  const opts = {
    method: !!options?.data ? 'POST' : 'GET',
    url: `http://${env.url}:4000/${what}${!!options?.param ? "/" + options.param : ""}${!!options?.query ? "?" + options.query : ""}`,
    headers: {
      cookie: info.cookie,
      'Content-Type': 'application/json'
    },
    data: options?.data
  };
  return await axios.request(opts)
    .then((response) => {
      console.clear();
      if (!!options?.data) console.log(what, "created successfully!")
      return response.data?.data
    })
    .catch((err) => console.error(err.response.status, err.response.statusText));
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
async function enableSocket() {
  process.stdin.removeAllListeners("data");
  const socket = io(`http://${env.url}:4000`, {
    extraHeaders: {
      "authorization": info.cookie?.replace("=", " ") as string,
      "chatId": info.chat?._id as string
    },
    // protocols: ["websockets", "polling"],
    autoConnect: false,
    reconnection: false,
    retries: 0,
  });
  ['connect_error', 'disconnect'].forEach((k) => socket.on(k, (error) => {
    console.log("connection failed!", error)
    process.stdin.removeAllListeners("data");
    enableActions();
  }));

  // Event listener for successful connection
  socket.on('connect', () => {
    printMessages();
    process.stdin.on('data', function (key: string) {
      switch (key.trim()) {
        case "back":
          socket.disconnect();
          console.log("back to main!")
          break;
        case "":
          break;
        default:
          break;
      }
    });
  });
  socket.connect();
}

setupInteractive().then(_ => {
  console.log("Application started");
})
  .catch(console.error)