import http from "k6/http";
import { check, sleep } from "k6";
const VUS = 10;
export const options = {
    scenarios: {
        login_and_find_user: {
            executor: "constant-vus",
            vus: VUS,
            duration: "30s",
            exec: "loginAndFindUser",
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
function findUser(token) {
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
export default function () {
    sleep(1);
}
