# Course Explorer

A browser app for browsing a course catalog. Load a JSON file of courses, then filter, sort and inspect each course. Built with plain JavaScript, HTML and CSS, no frameworks.

**Live demo:** [markhanna10.github.io/SE2202-MiniProject2](https://markhanna10.github.io/SE2202-MiniProject2/) · click **Load sample courses** to try it

## Features

- Load any course catalog from a local `.json` file with the File API
- Filter by department, level, credits and instructor, combined
- Sort by course ID, title or semester, in either direction
- Click a course to see its full details
- Clear error messages for wrong file types, invalid JSON and incomplete entries
- Escapes all file data before rendering to block HTML injection

## How it works

| File | Role |
| --- | --- |
| `index.html` | Layout: upload area, filter controls, course list and detail panel |
| `js/main.js` | `Course` class, file loading and validation, filter and sort logic, rendering |
| `css/style.css` | Two-column list and detail layout |
| `data/sample-courses.json` | Sample catalog with 12 fictional courses |

Semester sorting converts values such as `Fall 2025` into a sortable number (`year * 10 + season`), so Winter, Spring, Summer and Fall order correctly within each year.

## JSON format

The file must contain an array of objects. Each object needs a string `id`. Other fields are optional.

```json
[
  {
    "id": "SE 210",
    "title": "Scripting Languages",
    "department": "Software Engineering",
    "level": "200",
    "credits": 0.5,
    "instructor": "Instructor A",
    "semester": "Fall 2025",
    "description": "JavaScript, the DOM, events and asynchronous programming."
  }
]
```

## Run locally

```bash
git clone https://github.com/MarkHanna10/SE2202-MiniProject2.git
cd SE2202-MiniProject2
python3 -m http.server 8000
```

Open http://localhost:8000. The sample loader needs a local server, since browsers block `fetch` on `file://` pages.

---

Built by [Mark Hanna](https://github.com/MarkHanna10) for SE 2202 (Scripting Programming Languages) at Western University.
