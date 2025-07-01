# BulkLeet

BulkLeet is a  script that automates the process of fetching your solved LeetCode problems and uploading them to a GitHub repository. It  organizes the solutions into folders based on their corresponding topic tags and automatically generates a `README.md` file with categorized links to your solutions.

## Features

-   **Automated fetching:** Retrieves all your submissions from LeetCode using the `@leetnotion/leetcode-api`.
-   **Topic-based organization:** Uses a GraphQL query to fetch topic tags for each problem and creates corresponding directories in your GitHub repo.
-   **Bulk GitHub upload:** Commits each solution to the appropriate topic folder in your specified repository.
-   **Automatic README generation:** Scans your repository's structure and generates a clean, organized `README.md` file with links to all uploaded solutions, grouped by topic.
-   **Configurable:** Filter submissions by status (e.g., "Accepted") and programming language.
-   **Resilient:** Includes a retry mechanism to handle potential network errors during API requests.

## How It Works

1.  **Authentication:** The script initializes the LeetCode API using your session cookie.
2.  **Fetch Submissions:** It iteratively fetches your submissions from LeetCode in chunks of 20.
3.  **Process and Upload:** For each submission that matches your configured language and status:
    -   It sends a GraphQL query to LeetCode to get the problem's primary topic tag (e.g., "Array", "String", "Dynamic Programming").
    -   It checks if the solution file already exists in the target GitHub repository to prevent duplicates.
    -   It uses the GitHub API to upload the solution code into a folder named after its topic.
4.  **Generate README:** After processing all submissions, the script reads the directory tree of your GitHub repository. It then constructs a new `README.md` file, listing each topic as a header and linking to all solution files within that topic.
5.  **Update README:** Finally, it pushes the newly generated `README.md` to your repository.

## Setup and Configuration

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MuhammadSaim32/bulkleet.git
    cd bulkleet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Copy the `sample.env` file to a new file named `.env`.
    ```bash
    cp sample.env .env
    ```

4.  **Fill in the environment variables in your `.env` file:**

    -   `GIT_AUT_TOKEN`: Your GitHub Personal Access Token. 
    -   `LEETCODE_SESSION`: Your LeetCode session token. To get this:
        -   Log in to [LeetCode](https://leetcode.com).
        -   Open your browser's developer tools (F12 or Ctrl+Shift+I).
        -   Go to the `Application` (or `Storage`) tab, find `Cookies`, and select `https://leetcode.com`.
        -   Find the cookie named `LEETCODE_SESSION` and copy its value.
    -   `OWNER_NAME`: Your GitHub username.
    -   `OWNER_EMAIL`: The email address associated with your GitHub account.
    -   `QUESTION_STATUS`: The submission status to filter for. `Accepted` is recommended.
    -   `LANG`: The programming language of the submissions you want to upload (e.g., `cpp`, `python`, `java`).
    -   `REPO_NAME`: The name of the GitHub repository where your solutions will be uploaded. The repository must exist before running the script.

## Usage

Once you have configured your `.env` file, simply run the script from your terminal:

```bash
npm start
```

The script will begin fetching your submissions, uploading them to your specified repository, and finally, uploading the `README.md` file in that repository.
