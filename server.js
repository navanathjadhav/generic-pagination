const http = require("http");
const express = require("express");
const app = express();

/*
 * Define hostname & PORT
 */
const hostname = "localhost";
const port = 4000;

/*
 * CORS
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, access_token"
  );
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, OPTIONS, DELETE");
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

/*
 * Demo students data
 */
const students = [
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
  { name: "Alice Doe", email: "alice@xyz.com", department: "Computer Science" },
  {
    name: "John Doe",
    email: "john@xyz.com",
    department: "Information Technology",
  },
];

/*
 * Get students with query params: [pageNumber, recordsPerPage & searchTerm]
 */
app.get("/api/students", (req, res) => {
  let studentInternal = students;
  // Calculate start
  const start =
    parseInt(req.query.recordsPerPage) * (parseInt(req.query.pageNumber) - 1);
  // Calculate end
  const end = start + parseInt(req.query.recordsPerPage);

  // Match if searchTerm is received from client
  if (req.query.searchTerm) {
    studentInternal = students.filter((student) => {
      return (
        student.name.match(new RegExp(req.query.searchTerm, "i")) ||
        student.email.match(new RegExp(req.query.searchTerm, "i")) ||
        student.department.match(new RegExp(req.query.searchTerm, "i"))
      );
    });
  }

  // Send response: { count, data }
  res.status(200).json({
    count: studentInternal.length,
    data: studentInternal.slice(start, end),
  });
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});