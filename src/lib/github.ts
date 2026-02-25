import matter from "gray-matter";
import { marked } from "marked";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  order: number;
  repoUrl: string;
  liveUrl?: string;
  image?: string;
  body: string;
}

const GITHUB_USER = "travbrown";
const API = "https://api.github.com";

async function fetchJSON(url: string) {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "xprsn-portfolio",
    };

    if (import.meta.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${import.meta.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchShowcaseProjects(): Promise<Project[]> {
  const repos = await fetchJSON(
    `${API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
  );

  if (!repos || !Array.isArray(repos)) return [];

  const projects: Project[] = [];

  const checks = repos
    .filter((r: any) => !r.fork)
    .map(async (repo: any) => {
      const file = await fetchJSON(
        `${API}/repos/${GITHUB_USER}/${repo.name}/contents/SHOWCASE.md`
      );

      if (!file || !file.content) return;

      const raw = atob(file.content.replace(/\n/g, ""));
      const { data, content } = matter(raw);

      projects.push({
        title: data.title || repo.name,
        description: data.description || repo.description || "",
        tags: data.tags || [],
        featured: data.featured ?? false,
        order: data.order ?? 99,
        repoUrl: repo.html_url,
        liveUrl: data.live_url || repo.homepage || undefined,
        image: data.image || undefined,
        body: await marked.parse(content),
      });
    });

  await Promise.all(checks);

  return projects.sort((a, b) => a.order - b.order);
}
