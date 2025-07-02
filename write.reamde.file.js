import fs from "fs";
import get_repo_tree, { upload_readme } from "./get.repo.tree.js";
let main_url = `https://api.github.com/repos/${process.env.OWNER_NAME}/${process.env.REPO_NAME}/git/trees/main`;

async function write_readme_file() {
  const response_1 = await get_repo_tree(main_url);

  for (let i = 0; i < response_1.tree.length; i++) {
    const Topic = `\n## ${response_1.tree[i].path}\n\n`;

    // write the topic of Questions
    fs.writeFileSync("readme_file.md", Topic, { flag: "a+" });

    const response_2 = await get_repo_tree(response_1.tree[i].url);
  
    for (let j = 0; j < response_2.tree.length; j++) {
      let url = encodeURI(
        `${response_1.tree[i].path}/${response_2.tree[j].path}`
      );

      const links = `\n[${response_2.tree[j].path}](https://github.com/${process.env.OWNER_NAME}/${process.env.REPO_NAME}/blob/main/${url})\n`;
      fs.writeFileSync("readme_file.md", links, { flag: "a+" });
    }
  }

  const response = await upload_readme();
console.log("Question uploaded Successfully...");
}

export default write_readme_file;
