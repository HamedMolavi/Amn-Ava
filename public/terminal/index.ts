import axios from "axios";
import { writeFileSync } from "fs";
import * as readline from 'readline';

//TODO: add more commands
let watchInterval: NodeJS.Timeout | undefined = undefined;
type InfoType = {
  [key: string]: any
  "me": { _id: string, firstName: string, lastName: string, username: string, password: string, email: string, createdAt: number } | undefined
  "cookie": string | undefined
  "chat": { _id: string, type: string, user1Id: string, user2Id: string, createdAt: number } | undefined
}
var info: InfoType = {
  "me": undefined,
  "cookie": undefined,
  "chat": undefined
};

let env: { [key: string]: any } = {
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
      if ("-i" in action.split(" ")) console.log((!!name && !name.startsWith("-")) ? info[name] : info);
      else console.log((!!name && !name.startsWith("-")) ? env[name] : env);
      break;
    }
    //------------------------------------------------------------------//
    case ["register", "login"].includes(action): {
      loadUser(action === "register");
      break;
    }
    //------------------------------------------------------------------//
    case action.startsWith("select"): {
      const selectWhat = action.split(" ").slice(1).at(-1) as "users" | "chats" | "messages" | undefined;
      if (!!info.cookie) {
        console.log("Please login or register first!")
        break;
      } else if (!selectWhat || !["users", "chats", "messages"].includes(selectWhat)) {
        console.log("Bad selection: ", selectWhat)
        break;
      };
      let list = await pgpd(selectWhat);
      console.log(console.clear(), selectWhat, ":")
      for (const [index, item] of list.entries()) {
        console.log(index, ". ", item)
      }
      let choosenIndex = await input(selectWhat).then(({ [selectWhat]: val }) => parseInt(val));
      let choosenItem = list[choosenIndex];
      break;
    }
    //------------------------------------------------------------------//
    case action.startsWith("new"): {
      const createWhat = action.split(" ").slice(1).at(-1) as "chats" | "messages" | undefined;
      if (!!info.cookie || !!info.me?._id) {
        console.log("Please login or register first!")
        break;
      } else if (!createWhat || !["chats", "messages"].includes(createWhat)) {
        console.log("Bad selection: ", createWhat)
        break;
      };
      let list = await pgpd(createWhat, {
        data: createWhat === "chats"
          ? { "user1Id": info.me?._id, "user2Id": }
          : { "msg":, "chatId": info.chat?._id, "senderId": info.me?._id }
      });
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
        console.log(results)
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
  axios.request(options)
    .then(function (response) {
      info["cookie"] = response?.headers?.["set-cookie"]?.find((el) => el.startsWith("Bearer"))?.split(";")[0];
      info["me"] = response.data?.data;
    })
    .catch(console.error);
}

async function pgpd(what: "users" | "chats" | "messages", options?: { data?: { [key: string]: any } }): Promise<Array<any>> {
  const opts = {
    method: !!options?.data ? 'POST' : 'GET',
    url: `http://${env.url}:4000/${what}`,
    headers: {
      cookie: info.cookie,
      'Content-Type': 'application/json'
    },
    data: options?.data
  };
  return await axios.request(opts)
    .then((response) => response.data?.data)
    .catch(console.error);
}


setupInteractive().then(_ => {
  console.log("Application started");
})
  .catch(console.error)