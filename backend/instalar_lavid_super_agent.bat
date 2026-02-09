@echo off
echo ============================================
echo  INSTALADOR LAVID SUPER AGENT - MACAPA
echo ============================================
echo.

set FILE=lavid_super_agent.py

echo Creando archivo %FILE%...
echo.

(
echo """
echo LAVID LITE — SUPER AGENT CORE
echo Un solo script integral para:
echo - Investigar repositorios de GitHub
echo - Leer web / RSS
echo - Guardar conocimiento en una base local
echo - Exponer todo vía FastAPI
echo Compatible con Python 3.11 y librerías instaladas.
echo """
echo.
echo import json
echo from typing import List, Dict, Any, Optional
echo from datetime import datetime
echo.
echo import requests
echo import feedparser
echo from fastapi import FastAPI, Query
echo from pydantic import BaseModel
echo from sqlmodel import SQLModel, Field, create_engine, Session, select
echo.
echo GITHUB_USERS_DEFAULT = ["openai","deepmind","ray-project","tensorflow","pytorch","EleutherAI"]
echo DATASET_FILE = "lavid_github_dataset.json"
echo DB_URL = "sqlite:///lavid_knowledge.db"
echo engine = create_engine(DB_URL, echo=False)
echo app = FastAPI(title="LAVID SUPER AGENT CORE")
echo.
echo class RepoKnowledge(SQLModel, table=True):
echo ^    id: Optional[int] = Field(default=None, primary_key=True)
echo ^    owner: str
echo ^    name: str
echo ^    url: str
echo ^    language: Optional[str] = None
echo ^    stars: int = 0
echo ^    forks: int = 0
echo ^    updated_at: Optional[str] = None
echo ^    description: Optional[str] = None
echo ^    summary: Optional[str] = None
echo ^    keywords: Optional[str] = None
echo ^    created_at: datetime = Field(default_factory=datetime.utcnow)
echo.
echo class WebKnowledge(SQLModel, table=True):
echo ^    id: Optional[int] = Field(default=None, primary_key=True)
echo ^    source_type: str
echo ^    source_url: str
echo ^    title: Optional[str] = None
echo ^    content: Optional[str] = None
echo ^    created_at: datetime = Field(default_factory=datetime.utcnow)
echo.
echo def init_db():
echo ^    SQLModel.metadata.create_all(engine)
echo.
echo def extract_keywords(text: str, max_keywords: int = 20) -> List[str]:
echo ^    if not text:
echo ^        return []
echo ^    words = [w.strip(".,:;()[]{}\"'").lower() for w in text.split() if len(w) ^> 6]
echo ^    unique = list(dict.fromkeys(words))
echo ^    return unique[:max_keywords]
echo.
echo def save_repo_knowledge(items: List[Dict[str, Any]]) -> int:
echo ^    count = 0
echo ^    with Session(engine) as session:
echo ^        for item in items:
echo ^            keywords_json = json.dumps(item.get("keywords", []), ensure_ascii=False)
echo ^            repo = RepoKnowledge(
echo ^                owner=item["owner"],
echo ^                name=item["name"],
echo ^                url=item["url"],
echo ^                language=item.get("language"),
echo ^                stars=item.get("stars", 0),
echo ^                forks=item.get("forks", 0),
echo ^                updated_at=item.get("updated_at"),
echo ^                description=item.get("description"),
echo ^                summary=item.get("summary"),
echo ^                keywords=keywords_json,
echo ^            )
echo ^            session.add(repo)
echo ^            count += 1
echo ^        session.commit()
echo ^    return count
echo.
echo def save_web_knowledge(entries: List[Dict[str, Any]]) -> int:
echo ^    count = 0
echo ^    with Session(engine) as session:
echo ^        for e in entries:
echo ^            wk = WebKnowledge(
echo ^                source_type=e["source_type"],
echo ^                source_url=e["source_url"],
echo ^                title=e.get("title"),
echo ^                content=e.get("content"),
echo ^            )
echo ^            session.add(wk)
echo ^            count += 1
echo ^        session.commit()
echo ^    return count
echo.
echo def fetch_github_repos(user: str) -> List[Dict[str, Any]]:
echo ^    url = f"https://api.github.com/users/{user}/repos"
echo ^    resp = requests.get(url)
echo ^    if resp.status_code != 200:
echo ^        return []
echo ^    data = resp.json()
echo ^    repos = []
echo ^    for repo in data:
echo ^        repos.append({
echo ^            "owner": user,
echo ^            "name": repo["name"],
echo ^            "url": repo["html_url"],
echo ^            "stars": repo["stargazers_count"],
echo ^            "forks": repo["forks_count"],
echo ^            "language": repo["language"],
echo ^            "updated_at": repo["updated_at"],
echo ^            "description": repo["description"],
echo ^        })
echo ^    return repos
echo.
echo def fetch_readme(user: str, repo: str) -> Optional[str]:
echo ^    urls = [
echo ^        f"https://raw.githubusercontent.com/{user}/{repo}/main/README.md",
echo ^        f"https://raw.githubusercontent.com/{user}/{repo}/master/README.md",
echo ^    ]
echo ^    for url in urls:
echo ^        resp = requests.get(url)
echo ^        if resp.status_code == 200:
echo ^            return resp.text
echo ^    return None
echo.
echo def analyze_repo(repo_data: Dict[str, Any], readme_text: Optional[str]) -> Dict[str, Any]:
echo ^    return {
echo ^        "owner": repo_data["owner"],
echo ^        "name": repo_data["name"],
echo ^        "url": repo_data["url"],
echo ^        "language": repo_data["language"],
echo ^        "stars": repo_data["stars"],
echo ^        "forks": repo_data["forks"],
echo ^        "updated_at": repo_data["updated_at"],
echo ^        "description": repo_data["description"],
echo ^        "summary": (readme_text[:800] if readme_text else None),
echo ^        "keywords": extract_keywords(readme_text) if readme_text else [],
echo ^    }
echo.
echo def build_github_dataset(users: List[str]) -> List[Dict[str, Any]]:
echo ^    dataset = []
echo ^    for user in users:
echo ^        repos = fetch_github_repos(user)
echo ^        for repo in repos:
echo ^            readme = fetch_readme(user, repo["name"])
echo ^            analysis = analyze_repo(repo, readme)
echo ^            dataset.append(analysis)
echo ^    return dataset
echo.
echo def save_dataset_to_file(data: List[Dict[str, Any]], filename: str = DATASET_FILE):
echo ^    with open(filename, "w", encoding="utf-8") as f:
echo ^        json.dump(data, f, indent=2, ensure_ascii=False)
echo.
echo def fetch_rss_feed(url: str) -> List[Dict[str, Any]]:
echo ^    feed = feedparser.parse(url)
echo ^    entries = []
echo ^    for entry in feed.entries:
echo ^        entries.append({
echo ^            "source_type": "rss",
echo ^            "source_url": url,
echo ^            "title": entry.get("title"),
echo ^            "content": entry.get("summary", "")[:2000],
echo ^        })
echo ^    return entries
echo.
echo def fetch_web_page(url: str) -> Dict[str, Any]:
echo ^    resp = requests.get(url, timeout=15)
echo ^    if resp.status_code != 200:
echo ^        return {"source_type": "web","source_url": url,"title": f"HTTP {resp.status_code}","content": ""}
echo ^    text = resp.text
echo ^    return {"source_type": "web","source_url": url,"title": url,"content": text[:5000]}
echo.
echo class GitHubUsersRequest(BaseModel):
echo ^    users: List[str] = GITHUB_USERS_DEFAULT
echo.
echo class RSSRequest(BaseModel):
echo ^    url: str
echo.
echo class WebRequest(BaseModel):
echo ^    url: str
echo.
echo @app.on_event("startup")
echo def on_startup():
echo ^    init_db()
echo.
echo @app.post("/lavid/github/dataset/run")
echo def api_run_github_dataset(body: GitHubUsersRequest):
echo ^    data = build_github_dataset(body.users)
echo ^    save_dataset_to_file(data)
echo ^    saved = save_repo_knowledge(data)
echo ^    return {"status": "ok","users": body.users,"items_in_dataset": len(data),"items_saved_db": saved,"file": DATASET_FILE}
echo.
echo @app.get("/lavid/github/repos/{user}")
echo def api_get_github_repos(user: str):
echo ^    repos = fetch_github_repos(user)
echo ^    return {"user": user, "count": len(repos), "repos": repos}
echo.
echo @app.post("/lavid/rss/fetch")
echo def api_fetch_rss(body: RSSRequest):
echo ^    entries = fetch_rss_feed(body.url)
echo ^    saved = save_web_knowledge(entries)
echo ^    return {"status": "ok", "fetched": len(entries), "saved": saved}
echo.
echo @app.post("/lavid/web/fetch")
echo def api_fetch_web(body: WebRequest):
echo ^    entry = fetch_web_page(body.url)
echo ^    saved = save_web_knowledge([entry])
echo ^    return {"status": "ok", "saved": saved, "preview": entry["content"][:500]}
echo.
echo def cli_run_full_github_pipeline():
echo ^    data = build_github_dataset(GITHUB_USERS_DEFAULT)
echo ^    save_dataset_to_file(data)
echo ^    saved = save_repo_knowledge(data)
echo ^    print(f"[LAVID] Items: {len(data)}, guardados en DB: {saved}")
echo.
echo if __name__ == "__main__":
echo ^    cli_run_full_github_pipeline()
) > %FILE%

echo.
echo Instalación completada.
echo Archivo creado: %FILE%
echo.
pause
