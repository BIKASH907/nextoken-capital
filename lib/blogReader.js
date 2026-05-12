// Self-contained blog reader: parses frontmatter + markdown without external deps.
// Good enough for our content; not a full CommonMark implementation.
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "public", "blog");

function parseFrontmatter(src) {
  const meta = {};
  let body = src;
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (m) {
    const lines = m[1].split("\n");
    for (const line of lines) {
      const kv = line.match(/^([\w-]+):\s*"?(.*?)"?\s*$/);
      if (kv) meta[kv[1]] = kv[2];
    }
    body = m[2];
  }
  return { meta, body };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderInline(line) {
  let h = escapeHtml(line);
  // [text](url)
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // **bold**
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *italic*
  h = h.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s.,!?:;)]|$)/g, "$1<em>$2</em>");
  // `code`
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  return h;
}

function renderMarkdown(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  let inList = false;
  while (i < lines.length) {
    const line = lines[i];
    if (/^### /.test(line)) {
      out.push(`<h3>${renderInline(line.slice(4))}</h3>`); i++; continue;
    }
    if (/^## /.test(line)) {
      out.push(`<h2>${renderInline(line.slice(3))}</h2>`); i++; continue;
    }
    if (/^# /.test(line)) {
      out.push(`<h1>${renderInline(line.slice(2))}</h1>`); i++; continue;
    }
    if (/^---\s*$/.test(line)) {
      out.push("<hr />"); i++; continue;
    }
    if (/^- /.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${renderInline(line.slice(2))}</li>`); i++; continue;
    } else if (inList && line.trim() === "") {
      out.push("</ul>"); inList = false; i++; continue;
    } else if (inList) {
      out.push("</ul>"); inList = false;
    }
    if (line.trim() === "") { i++; continue; }
    // paragraph: gather contiguous non-empty non-header non-list lines
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#|---|- )/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${renderInline(para.join(" "))}</p>`);
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

export function listPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const src = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { meta } = parseFrontmatter(src);
    return {
      slug: meta.slug || file.replace(/\.md$/, ""),
      title: meta.title || file,
      excerpt: meta.excerpt || "",
      date: meta.date || "",
      author: meta.author || "Nextoken Capital",
      category: meta.category || "Article",
      readTime: meta.readTime || "5 min",
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getPost(slug) {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const src = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { meta, body } = parseFrontmatter(src);
    if ((meta.slug || file.replace(/\.md$/, "")) === slug) {
      return {
        slug,
        title: meta.title || file,
        excerpt: meta.excerpt || "",
        date: meta.date || "",
        author: meta.author || "Nextoken Capital",
        category: meta.category || "Article",
        readTime: meta.readTime || "5 min",
        html: renderMarkdown(body),
      };
    }
  }
  return null;
}
