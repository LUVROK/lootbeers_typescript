import { Client, auth } from "twitter-api-sdk";

export default function twitterapi(URLtitle) {
  const authClient = new auth.OAuth2User({
    client_id: "UEJaMHMwd0xkeG9WM0pZakdFSEQ6MTpjaQ",
    client_secret: "hBEe61zFs29s5VS1PWsFVr2jCpHz_bMaXAky9UULcq3v6C1GC-",
    callback: "http://localhost:3000/free_lootbox/",
    // callback: `https://lootbeers.com/${URLtitle}`,
    scopes: ["offline.access", "users.read", "tweet.read", "like.read"],
  });
  const client = new Client(authClient);

  const urlco = authClient.generateAuthURL({
    state: "twitter-state",
    code_challenge: "challenge",
    code_challenge_method: "plain",
    code_verifier: "challenge",
  });
  return urlco;
}
