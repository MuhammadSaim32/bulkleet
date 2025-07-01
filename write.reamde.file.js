import fs from "fs";
import get_repo_tree, { upload_readme } from "./get.repo.tree.js";
let main_url = `https://api.github.com/repos/${process.env.OWNER_NAME}/dsa/git/trees/main`;

async function write_readme_file() {
  const response_1 = await get_repo_tree(main_url);

  for (let i = 0; i < response_1.tree.length; i++) {
    const Topic = `\n## ${response_1.tree[i].path}\n\n`;

    // write the topic of Questions
    fs.writeFileSync("readme.md", Topic, { flag: "a+" });

    const response_2 = await get_repo_tree(response_1.tree[i].url);
    console.log(response_2);
    for (let j = 0; j < response_2.tree.length; j++) {
      let url = encodeURI(
        `${response_1.tree[i].path}/${response_2.tree[j].path}`
      );

      const links = `\n[${response_2.tree[j].path}](https://github.com/${process.env.OWNER_NAME}/dsa/blob/main/${url})\n`;
      fs.writeFileSync("readme.md", links, { flag: "a+" });
    }
  }

  const response = await upload_readme();
}

export default write_readme_file;
