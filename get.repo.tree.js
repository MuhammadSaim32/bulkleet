import "dotenv/config";
import { readFileSync } from "fs";

async function get_repo_tree(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GIT_AUT_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const response_tree = await response.json();
  return response_tree;
}

export async function upload_readme() {
  const readme = readFileSync("./readme.md", "utf8");
  let obj = {
    message: "readme_updated",
    committer: {
      name: `${process.env.OWNER_NAME}`,
      email: `${process.env.OWNER_EMAIL}`,
    },
    content: Buffer.from(readme).toString("base64"),
  };

  const user = await fetch(
    `  https://api.github.com/repos/${process.env.OWNER_NAME}/dsa/contents/readme.md`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GIT_AUT_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(obj),
    }
  );

  let user2 = await user.json();
  return user2;
}

export default get_repo_tree;
