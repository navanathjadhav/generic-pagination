import React, { useState } from "react";
import "./App.scss";
import {
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Pagination } from "./pagination/pagination";

function App() {
  // Hooks
  const [students, setStudents] = useState([] as any);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [isLoadingStudents, setLoadingStudents] = useState(false);
  const [isSearchingStudents, setSearchingStudents] = useState(false);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState({} as any);
  const { register, handleSubmit, errors } = useForm();

  /*
   * Clear search results
   * Make search object empty if no value
   * Trigger reload in pagination
   */
  const clearSearchResults = (event: any) => {
    if (!event.target.value && search) {
      setSearch({
        term: "",
      });
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 1000);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="flex-grow-1 filter-container-c">
          <div className="search">
            <Form onSubmit={handleSubmit(setSearch)}>
              <Row>
                <Col md={6} lg={6}>
                  <InputGroup>
                    <FormControl
                      className="c-f h-45"
                      placeholder="Search students"
                      aria-label="Search students"
                      aria-describedby="basic-addon2"
                      name="term"
                      onChange={clearSearchResults}
                      ref={register({
                        required: true,
                      })}
                      isInvalid={errors.term}
                    />
                    <span>
                      <i className="bx bx-fw bx-search"></i>
                    </span>
                    <InputGroup.Append>
                      <button
                        className="btn btn-primary"
                        disabled={isSearchingStudents}
                      >
                        {isSearchingStudents ? "Searching..." : "Search"}
                      </button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col md={6} lg={6}>
                  <div className="d-flex align-items-center justify-content-end">
                    <Form.Group>
                      <label className="pr-3">Records per page</label>
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        custom
                        name="recordsPerPage"
                        defaultValue={5}
                        onChange={(e) =>
                          setRecordsPerPage(parseInt(e.target.value))
                        }
                      >
                        <option value="">Select value</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
      <Row>
        <Col md={12} lg={12}>
          <h3>Students</h3>
          <Card>
            <Card.Body className="pt-0">
              <Table striped hover>
                <thead>
                  <tr>
                    <th className="bt-none">Name</th>
                    <th className="bt-none">Email</th>
                    <th className="bt-none">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {!students.length && !isLoadingStudents && (
                    <tr className="text-center">
                      <td colSpan={3}>No students</td>
                    </tr>
                  )}
                  {isLoadingStudents && (
                    <tr className="text-center">
                      <td colSpan={3}>
                        <span>Loading...</span>
                      </td>
                    </tr>
                  )}
                  {!isLoadingStudents &&
                    students.map((student: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.department}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              <Pagination
                apiRoute={`/api/students`}
                recordsPerPage={recordsPerPage}
                responseData={setStudents}
                isLoadingData={setLoadingStudents}
                reloadApi={reload}
                search={search}
                isSearchingData={setSearchingStudents}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
