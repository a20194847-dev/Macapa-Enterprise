import json
import requests

REPOS = [
    "huggingface/transformers",
    "langchain-ai/langchain",
    "run-llama/llama_index",
    "sentence-transformers/sentence-transformers",
    "chroma-core/chroma"
]

def analyze_repo(full_name):
    print("Analyzing", full_name, "...")
    url = "https://api.github.com/repos/" + full_name
    r = requests.get(url)

    if r.status_code != 200:
        print("Failed to fetch", full_name)
        return None

    data = r.json()
    return {
        "name": full_name,
        "stars": data.get("stargazers_count"),
        "forks": data.get("forks_count"),
        "open_issues": data.get("open_issues_count"),
        "description": data.get("description"),
        "url": data.get("html_url")
    }

def main():
    results = []
    for repo in REPOS:
        info = analyze_repo(repo)
        if info:
            results.append(info)

    with open("analysis/repos_analysis.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("Saved repo analysis to analysis/repos_analysis.json")

if __name__ == "__main__":
    main()
