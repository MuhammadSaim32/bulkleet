import { LeetCode, Credential } from "@leetnotion/leetcode-api";
import "dotenv/config";
import { retry_request } from "./retry.js";
import upload_all_questions from "./upload.questions.js";
import write_readme_file from "./write.reamde.file.js";
const credential = new Credential();
await credential.init(process.env.LEETCODE_SESSION);
const leetcode = new LeetCode(credential);

// get submissions in chunks  (each chucks of 20 size)
async function get_submissions_in_chunks(limit_value, offset_value) {
  await sleep();

  let response = await leetcode.submissions({
    limit: limit_value,
    offset: offset_value,
  });
  return response;
}

// function for delay between requests to leetcode server otherwise error ocurr
async function sleep() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("wait 5 sec ...");
    }, 5000);
  });
}

// starting point
async function main_func() {
  let offset_value = 0;
  let limit_value = 20;

  while (true) {
    const response = await retry_request(
      get_submissions_in_chunks,
      limit_value,
      offset_value
    );

    if (response.length == 0) {
      await upload_all_questions(response);
      break;
    } else {
      offset_value += limit_value;
      await upload_all_questions(response);
      await sleep();
    }
  }
  await write_readme_file();
}

main_func();
