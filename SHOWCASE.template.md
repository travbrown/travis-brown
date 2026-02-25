# SHOWCASE.md Template

Copy this file as `SHOWCASE.md` into the root of any GitHub repo you want
displayed on your portfolio. The frontmatter controls how the project appears;
the markdown body is the detailed description (rendered on hover/expand later).

---

```markdown
---
title: "Project Name"
description: "A one-line summary of the project."
tags: ["Tag1", "Tag2", "Tag3"]
featured: true
order: 1
live_url: "https://your-live-demo.com"
image: "/images/project-screenshot.png"
---

Write a longer description of the project here. What problem does it solve?
What did you learn? What technologies did you use?

This content is parsed as markdown and can include **bold**, _italic_,
`code`, lists, and more.
```

## Frontmatter Fields

| Field         | Required | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `title`       | Yes      | Display name for the project                         |
| `description` | Yes      | Short one-liner shown on the project card            |
| `tags`        | No       | Array of technology/topic tags                       |
| `featured`    | No       | Set `true` to show on the landing page (default: false) |
| `order`       | No       | Sort order — lower numbers appear first (default: 99) |
| `live_url`    | No       | Link to a live demo or deployed version              |
| `image`       | No       | Path to a screenshot (place in `public/images/`)     |
