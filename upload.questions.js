import "dotenv/config";
import { readFileSync } from "fs";
import write_readme_file from "./write.reamde.file.js";
import { retry_request } from "./retry.js";

const query = readFileSync("./Question.graphql", "utf8");

async function get_question_topic(title_slug) {
  let request_body = {
    query,
    variables: {
      titleSlug: title_slug,
    },
  };
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      LEETCODE_SESSION: `${process.env.LEETCODE_SESSION}`,
    },
    body: JSON.stringify(request_body),
  });
  const response_in_json = await response.json();
  return response_in_json.data.question.topicTags["0"].name;
}

async function check_question_exist(title_slug, lang, topic) {
  const response = await fetch(
    `https://api.github.com/repos/${process.env.OWNER_NAME}/${process.env.REPO_NAME}/contents/${topic}/${title_slug}.${lang}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.GIT_AUT_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const response_in_josn = await response.json();
  return response_in_josn.status == 404;
}

//upload single question
async function commit_file(topic, title_slug, lang, code) {
  let request_body = {
    message: title_slug,
    committer: {
      name: `${process.env.OWNER_NAME}`,
      email: `${process.env.OWNER_EMAIL}`,
    },
    content: Buffer.from(code).toString("base64"),
  };

  const response = await fetch(
    `  https://api.github.com/repos/${process.env.OWNER_NAME}/${process.env.REPO_NAME}/contents/${topic}/${title_slug}.${lang}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GIT_AUT_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(request_body),
    }
  );
}

async function upload_question(code, title_slug, lang) {
  const topic = await retry_request(get_question_topic, title_slug);
  let check = await retry_request(
    check_question_exist,
    title_slug,
    lang,
    topic
  );
  if (check) {
    await retry_request(commit_file, topic, title_slug, lang, code);
  }
}

async function upload_all_questions(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i].lang == `${process.env.LANG}` &&
      arr[i].status_display == `${process.env.QUESTION_STATUS}`
    ) {
      await upload_question(arr[i].code, arr[i].title_slug, arr[i].lang);
    }
  }
}

export default upload_all_questions;
