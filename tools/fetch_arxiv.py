import arxiv
import json
import argparse

def fetch_arxiv(query, max_results, out_file):
    print("Fetching arXiv papers for query:", query)

    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    papers = []
    for result in search.results():
        papers.append({
            "id": result.entry_id,
            "title": result.title,
            "summary": result.summary,
            "authors": [a.name for a in result.authors],
            "published": str(result.published)
        })

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(papers, f, indent=2, ensure_ascii=False)

    print("Saved", len(papers), "papers to", out_file)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=str, required=True)
    parser.add_argument("--max_results", type=int, default=20)
    parser.add_argument("--out", type=str, required=True)
    args = parser.parse_args()

    fetch_arxiv(args.query, args.max_results, args.out)
