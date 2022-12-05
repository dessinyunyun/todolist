import React from "react";
import { Container, Button, Row, Col, Modal, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import List from "./ActivityList";

const ActivityDetail = () => {
  const [listActivity, setlistActivity] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [refresh, setrefresh] = React.useState(false);
  const [activityDetail, setactivityDetail] = React.useState([]);
  const [showEditTitle, setshowEditTitle] = React.useState(false);
  const [showPrioritySelect, setshowPrioritySelect] = React.useState(false);
  const [showAlert, setshowAlert] = React.useState(false);
  const [newlistActivity, setnewlistActivity] = React.useState({
    title: "",
    priority: "very-high",
  });

  React.useEffect(() => {
    var pageURL = window.location.href;
    var lastURLSegment = pageURL.substr(pageURL.lastIndexOf("/") + 1);

    getActivityDetail(lastURLSegment);
    getActivityList(lastURLSegment);
  }, [refresh]);

  const getActivityDetail = async (id) => {
    var config = {
      method: "get",
      url: `https://todo.api.devcode.gethired.id/activity-groups/${id}`,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        setactivityDetail(response.data);
      })
      .catch(function (error) {});
  };

  const getActivityList = async (idActivity) => {
    var config = {
      method: "get",
      url: `https://todo.api.devcode.gethired.id/todo-items?activity_group_id=${idActivity}`,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        setlistActivity(response.data.data);
      })
      .catch(function (error) {});
  };

  const editTitleActivity = async (e) => {
    setactivityDetail((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    var data = JSON.stringify({
      title: e.target.value,
    });

    var config = {
      method: "patch",
      url: `https://todo.api.devcode.gethired.id/activity-groups/${activityDetail.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {})
      .catch(function (error) {});
  };

  const addListActivity = async (e) => {
    e.preventDefault();
    var data = JSON.stringify({
      activity_group_id: activityDetail.id,
      title: newlistActivity.title,
      priority: newlistActivity.priority,
    });

    var config = {
      method: "post",
      url: "https://todo.api.devcode.gethired.id/todo-items",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {})
      .catch(function (error) {});

    setnewlistActivity("");
    setrefresh(!refresh);
  };

  const [prioritySelect, setprioritySelect] = React.useState(
    <div className="kiri">
      <i className="fi fi-ss-circle label-indicator " data-cy="todo-item-priority-indicator" style={{ color: "#ed4c5c", fontSize: "15px" }}></i> Very High
    </div>
  );

  return (
    <Container className="py-5">
      <Row className="header d-flex justify-content-between">
        <Col className="activity col-12 col-sm-9 d-flex align-items-center">
          <Link to="/" style={{ textDecoration: "none", border: "#16abf8" }} data-cy="todo-back-button">
            <i className="fi fi-bs-angle-left fs-5 fw-bold text-dark"></i>
          </Link>
          <Form className="d-flex align-items-center ">
            {showEditTitle ? (
              <Form.Control type="text" name="title" className="text-form" placeholder="Enter Activity" value={activityDetail.title} onChange={editTitleActivity} />
            ) : (
              <h2 className="fw-bold fs-1" data-cy="todo-title">
                {activityDetail.title}
              </h2>
            )}
            {showEditTitle ? (
              <i className="fi fi-rs-check" data-cy="todo-title-save-button" style={{ cursor: "pointer" }} onClick={() => setshowEditTitle(false)}></i>
            ) : (
              <i className="fi fi-rs-pencil mx-3" data-cy="todo-title-edit-button" style={{ cursor: "pointer" }} onClick={() => setshowEditTitle(true)}></i>
            )}
          </Form>
        </Col>

        <Col className="right col-12 col-sm-3 d-flex align-items-center position-relative">
          <Button data-cy="todo-add-button" size="lg" className="button rounded-pill fw-bold" onClick={() => setShow(true)} style={{ backgroundColor: "#16abf8", border: "#16abf8", padding: "10px 30px 10px 30px" }}>
            + Tambah
          </Button>
        </Col>
      </Row>
      {/*  alert succes delete */}
      <Alert show={showAlert} variant="success" className="d-flex flex-column justify-content-center mt-5" data-cy="modal-information">
        <p style={{ margin: "0" }} className="text-center">
          {" "}
          <span className="fw-bold">List</span> telah dihapus
        </p>
        <div className="d-flex justify-content-end">
          <Button onClick={() => setshowAlert(false)} variant="outline-success">
            Tutup
          </Button>
        </div>
      </Alert>
      {/* End  alert succes delete */}
      <Row className="mt-5">
        {listActivity.length > 0 ? (
          listActivity.map((list) => {
            return <List key={list.id} list={list} refresh={refresh} setrefresh={setrefresh} setshowAlert={setshowAlert} showAlert={showAlert} />;
          })
        ) : (
          <div className="d-flex justify-content-center" data-cy="todo-empty-state">
            <img src="/td-lost.png" alt="" width={"500px"} style={{ cursor: "pointer" }} onClick={() => setShow(true)} />
          </div>
        )}
      </Row>

      {/* MODAL ADD LIST */}
      <Modal show={show} onHide={() => setShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Add List Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fw-bold">List Activity Name</Form.Label>
              <Form.Control
                data-cy="modal-add-name-input"
                size="lg"
                type="text"
                placeholder="Enter List"
                name="title"
                value={newlistActivity.title}
                onChange={(e) =>
                  setnewlistActivity((prev) => {
                    return {
                      ...prev,
                      [e.target.name]: e.target.value,
                    };
                  })
                }
              />
              <div className="priority-menu" data-cy="modal-add-priority-dropdown">
                <Form.Label className="mt-4 fw-bold" dt-cy="modal-add-priority-title">
                  Priority
                </Form.Label>
                <div data-cy="modal-add-priority-item" className="form-control d-flex align-content-center justify-content-between" onClick={() => setshowPrioritySelect(!showPrioritySelect)}>
                  {prioritySelect}
                  <i className="fi fi-rs-angle-small-down d-flex align-self-center" data-cy="modal-add-priority-dropdown" onClick={() => setshowPrioritySelect(!showPrioritySelect)}></i>
                </div>
                {showPrioritySelect ? (
                  <div className="priority-select mt-1">
                    <ul>
                      <li>
                        <div
                          data-cy="modal-add-priority-item"
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            setnewlistActivity((prev) => {
                              return {
                                ...prev,
                                priority: "very-high",
                              };
                            });
                            setprioritySelect(
                              <div className="kiri">
                                <i className="fi fi-ss-circle label-indicator " data-cy="todo-item-priority-indicator" style={{ color: "#ed4c5c", fontSize: "15px" }}></i> Very High
                              </div>
                            );
                          }}
                        >
                          {" "}
                          <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#ed4c5c", fontSize: "15px" }}></i> Very High
                        </div>
                      </li>
                      <li>
                        {" "}
                        <div
                          data-cy="modal-add-priority-item"
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            setnewlistActivity((prev) => {
                              return {
                                ...prev,
                                priority: "high",
                              };
                            });
                            setprioritySelect(
                              <div className="kiri">
                                <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#f8a541", fontSize: "15px" }}></i> High
                              </div>
                            );
                          }}
                        >
                          {" "}
                          <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#f8a541", fontSize: "15px" }}></i> High
                        </div>
                      </li>
                      <li>
                        {" "}
                        <div
                          data-cy="modal-add-priority-item"
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            setnewlistActivity((prev) => {
                              return {
                                ...prev,
                                priority: "normal",
                              };
                            });
                            setprioritySelect(
                              <div className="kiri">
                                <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#00a790", fontSize: "15px" }}></i> Medium
                              </div>
                            );
                          }}
                        >
                          <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#00a790", fontSize: "15px" }}></i> Medium
                        </div>
                      </li>
                      <li>
                        <div
                          data-cy="modal-add-priority-item"
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            setnewlistActivity((prev) => {
                              return {
                                ...prev,
                                priority: "low",
                              };
                            });
                            setprioritySelect(
                              <div className="kiri">
                                <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#428bc1", fontSize: "15px" }}></i> Low
                              </div>
                            );
                          }}
                        >
                          <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#428bc1", fontSize: "15px" }}></i> Low
                        </div>
                      </li>
                      <li>
                        <div
                          data-cy="modal-add-priority-item"
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            setnewlistActivity((prev) => {
                              return {
                                ...prev,
                                priority: "very-low",
                              };
                            });
                            setprioritySelect(
                              <div className="kiri">
                                <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#8942c1", fontSize: "15px" }}></i> Very Low
                              </div>
                            );
                          }}
                        >
                          <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: "#8942c1", fontSize: "15px" }}></i> Very Low
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-cy="modal-add-save-button"
              id="AddFormSubmit"
              onClick={(e) => {
                addListActivity(e);
                setShow(false);
              }}
              className="button rounded-pill fw-bold"
              style={{ backgroundColor: "#16abf8", border: "#16abf8", padding: "10px 30px 10px 30px" }}
            >
              Tambah
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* END MODAL ADD LIST */}
    </Container>
  );
};

export default ActivityDetail;
