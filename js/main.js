let courses = [];

const fileInput = document.getElementById("fileInput");
const errorMsg = document.getElementById("errorMsg");

const deptFilter = document.getElementById("deptFilter");
const levelFilter = document.getElementById("levelFilter");
const creditsFilter = document.getElementById("creditsFilter");
const instrFilter = document.getElementById("instrFilter");
const sortBy = document.getElementById("sortBy");

const courseList = document.getElementById("courseList");
const details = document.getElementById("details");

/* CLASS */
class Course {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.department = data.department;
    this.level = data.level;
    this.credits = data.credits;
    this.instructor = data.instructor;
    this.semester = data.semester;
    this.description = data.description;
    this.posted = data.posted;
    this.type = data.type;
    this.skill = data.skill;
    this.detail = data.detail;
  }
}

/* ERROR HELPERS */
function setError(msg) {
  errorMsg.textContent = msg;
}

function clearError() {
  errorMsg.textContent = "";
}

/* LOAD JSON */
fileInput.addEventListener("change", async event => {
  clearError();

  const file = event.target.files[0];
  if (!file) {
    setError("No file selected.");
    return;
  }

  if (!file.name.toLowerCase().endsWith(".json")) {
    setError("Invalid file type. Select a JSON file.");
    return;
  }

  try {
    const text = await file.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      setError("Invalid JSON file format.");
      return;
    }

    loadCourses(data);
  } catch {
    setError("Failed to load file.");
  }
});

/* LOAD SAMPLE DATA */
document.getElementById("sampleBtn").addEventListener("click", async () => {
  clearError();
  try {
    const res = await fetch("data/sample-courses.json");
    loadCourses(await res.json());
  } catch {
    setError("Failed to load sample data.");
  }
});

/* VALIDATE AND DISPLAY */
function loadCourses(data) {
  if (!Array.isArray(data)) {
    setError("JSON must contain an array of course objects.");
    return;
  }

  if (data.length === 0) {
    setError("JSON contains no courses.");
    return;
  }

  const valid = data.every(obj => obj && typeof obj === "object" && typeof obj.id === "string");
  if (!valid) {
    setError("JSON contains incomplete course entries.");
    return;
  }

  courses = data.map(v => new Course(v));

  buildFilterOptions(courses);
  renderCourseList(courses);
  details.innerHTML = "<p>Select a course to view details.</p>";
}

/* FILTER OPTIONS */
function buildFilterOptions(list) {
  fillSelect(deptFilter, unique(list.map(c => c.department)));
  fillSelect(levelFilter, unique(list.map(c => c.level)));
  fillSelect(creditsFilter, unique(list.map(c => c.credits)));
  fillSelect(instrFilter, unique(list.map(c => c.instructor)));
}

function fillSelect(select, values) {
  select.innerHTML = "<option value='All'>All</option>";
  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

function unique(arr) {
  return [...new Set(arr)].filter(v => v !== undefined && v !== null);
}

/* APPLY FILTERS */
function applyFilters() {
  let list = courses;

  const d = deptFilter.value;
  const l = levelFilter.value;
  const c = creditsFilter.value;
  const i = instrFilter.value;

  if (d !== "All") list = list.filter(v => v.department == d);
  if (l !== "All") list = list.filter(v => v.level == l);
  if (c !== "All") list = list.filter(v => v.credits == c);
  if (i !== "All") list = list.filter(v => v.instructor == i);

  list = sortCourses(list);

  renderCourseList(list);
}

/* SORTING */
function semesterValue(str) {
  if (!str) return 0;
  const [season, yearStr] = str.split(" ");
  const year = parseInt(yearStr);
  const order = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
  return year * 10 + order[season];
}

function sortCourses(list) {
  const key = sortBy.value;
  const sorted = [...list];

  if (key === "None") return sorted;

  if (key === "idAZ") return sorted.sort((a, b) => a.id.localeCompare(b.id));
  if (key === "idZA") return sorted.sort((a, b) => b.id.localeCompare(a.id));
  if (key === "titleAZ") return sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (key === "titleZA") return sorted.sort((a, b) => b.title.localeCompare(a.title));
  if (key === "semEarly") return sorted.sort((a, b) => semesterValue(a.semester) - semesterValue(b.semester));
  if (key === "semLate") return sorted.sort((a, b) => semesterValue(b.semester) - semesterValue(a.semester));

  return sorted;
}

/* RENDER LIST */
function renderCourseList(list) {
  courseList.innerHTML = "";
  list.forEach(course => {
    const div = document.createElement("div");
    div.textContent = course.id;
    div.addEventListener("click", () => showDetails(course));
    courseList.appendChild(div);
  });
}

/* SHOW DETAILS */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function showDetails(course) {
  const show = v => escapeHtml(v || "N/A");
  details.innerHTML = `
    <h2>${escapeHtml(course.id)}</h2>

    <p><strong>Title:</strong> ${show(course.title)}</p>
    <p><strong>Department:</strong> ${show(course.department)}</p>
    <p><strong>Level:</strong> ${show(course.level)}</p>
    <p><strong>Credits:</strong> ${show(course.credits)}</p>
    <p><strong>Instructor:</strong> ${show(course.instructor)}</p>
    <p><strong>Semester:</strong> ${show(course.semester)}</p>

    <p>${escapeHtml(course.description || "")}</p>
  `;
}

/* FILTER EVENTS */
deptFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);
creditsFilter.addEventListener("change", applyFilters);
instrFilter.addEventListener("change", applyFilters);
sortBy.addEventListener("change", applyFilters);