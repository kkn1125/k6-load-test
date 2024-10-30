import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";

const VUS = 10;

export const options: Options = {
  // A number specifying the number of VUs to run concurrently.
  // vus: 10,
  // duration: "10s",
  // A string specifying the total duration of the test run.
  // stages: [
  //   { duration: "15s", target: 5 },
  //   { duration: "15s", target: 100 },
  //   { duration: "5s", target: 10 },
  //   { duration: "10s", target: 0 },
  //   { duration: "5s", target: 0 },
  // ],
  scenarios: {
    login_and_find_user: {
      executor: "constant-vus",
      vus: VUS,
      duration: "30s",
      exec: "loginAndFindUser",
      // startTime: "5s",
      // iterations: 1500,
      // maxDuration: "30s",
    },
    find_user_by_condition_ramping: {
      executor: "ramping-vus",
      startVUs: 0,
      exec: "loginAndFindUser",
      stages: [
        { duration: "15s", target: VUS },
        { duration: "15s", target: VUS * 2 },
        { duration: "5s", target: VUS },
        { duration: "10s", target: 0 },
        { duration: "5s", target: 0 },
      ],
    },
  },
};

function loginAndGetToken() {
  const loginRes = http.post("http://localhost:8080/api/auth/signin", {
    email: "chaplet01@gmail.com",
    password: "1234",
  });
  check(loginRes, {
    "status is 200": (res) => res.status === 200,
  });
  return loginRes;
}

function findUser(token: string) {
  const params = {
    cookies: {
      token,
    },
  };
  const userFindRes = http.get("http://localhost:8080/api/users", params);
  check(userFindRes, {
    "status is 200": (res) => res.status === 200,
  });
  return userFindRes;
}

export function loginAndFindUser() {
  const loginRes = loginAndGetToken();
  const userFindRes = findUser(loginRes.cookies["token"][0]["value"]);
}

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
// export function setup() {
//   const loginRes = loginAndGetToken();

//   check(loginRes, {
//     "status is 200": (res) => res.status === 200,
//   });
//   return loginRes.cookies["token"][0]["value"];
// }

export default function (/* token */) {
  // const params = {
  //   cookies: {
  //     token,
  //   },
  // };
  // /* login */
  // const userFindRes = http.get("http://localhost:8080/api/users", params);
  // check(userFindRes, {
  //   "status is 200": (res) => res.status === 200,
  // });

  sleep(1);
}
