import React from "react";
import { Button, Card, Col, Modal, Form, Row } from "react-bootstrap";
import axios from "axios";

function ActivityList(props) {
  const [showEdit, setshowEdit] = React.useState(false);
  const [checked, setchecked] = React.useState(false);
  const [showPrioritySelect, setshowPrioritySelect] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [editList, seteditList] = React.useState({
    id: "",
    title: "",
    priority: "",
    is_active: "",
  });
  const handleClosedelete = () => setShowDelete(false);

  React.useEffect(() => {
    if (props.list.is_active === 0) {
      setchecked(true);
    }
  }, []);

  const saveEditList = async (e) => {
    e.preventDefault();

    var data = JSON.stringify({
      title: editList.title,
      priority: editList.priority,
    });

    var config = {
      method: "patch",
      url: `https://todo.api.devcode.gethired.id/todo-items/${editList.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {})
      .catch(function (error) {});
    props.setrefresh(!props.refresh);
  };
  let colorList;
  let colorItem = () => {
    if (props.list.priority === "very-high") {
      return (colorList = "#ed4c5c");
    } else if (props.list.priority === "high") {
      return (colorList = "#f8a541");
    } else if (props.list.priority === "normal") {
      return (colorList = "#00a790");
    } else if (props.list.priority === "low") {
      return (colorList = "#428bc1");
    } else {
      return (colorList = "#8942c1");
    }
  };
  colorItem();

  const [prioritySelect, setprioritySelect] = React.useState(
    <div className="kiri">
      <i className="fi fi-ss-circle label-indicator " data-cy="todo-item-priority-indicator" style={{ color: colorList, fontSize: "15px" }}></i> {props.list.priority}
    </div>
  );

  return (
    <Col className="col-sm-12 mb-2" key={props.list.id}>
      <Card className="p-3  Small shadow-local d-flex rounded-3" data-cy="activity-item" body>
        <Form>
          <Form.Group controlId="formBasicCheckbox" className="d-flex justify-content-between">
            <div className="content-item d-flex align-items-center align-content-center">
              <Form.Check
                data-cy="todo-item-checkbox"
                type="checkbox"
                defaultChecked={props.list.is_active === 1 ? false : true}
                onClick={async (e) => {
                  setchecked(!checked);

                  var data = JSON.stringify({
                    is_active: e.target.checked === false ? true : false,
                  });

                  var config = {
                    method: "patch",
                    url: `https://todo.api.devcode.gethired.id/todo-items/${props.list.id}`,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    data: data,
                  };

                  await axios(config)
                    .then(function (response) {})
                    .catch(function (error) {});
                }}
              />
              <i className="fi fi-ss-circle label-indicator" data-cy="todo-item-priority-indicator" style={{ color: colorList }}></i>
              <span className={checked ? "text-decoration-line-through text-muted" : ""} data-cy="todo-item-title">
                {props.list.title}
              </span>{" "}
              <i
                data-cy="todo-item-edit-button"
                className="fi fi-rs-pencil mx-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  seteditList({
                    id: props.list.id,
                    title: props.list.title,
                    priority: props.list.priority,
                  });
                  setshowEdit(true);
                }}
              ></i>
            </div>

            <i className="fi fi-rs-trash fs-5 text-muted" data-cy="todo-item-delete-button" accessKey={props.list.id} style={{ cursor: "pointer" }} onClick={() => setShowDelete(true)}></i>
          </Form.Group>{" "}
        </Form>
      </Card>

      {/* Modal Delete */}
      <Modal data-cy="modal-delete" show={showDelete} onHide={handleClosedelete} aria-labelledby="contained-modal-title-vcenter" className="rounded-3" centered>
        <Modal.Body className="d-flex flex-column justify-content-center">
          <img src="/alert.png" width="100px" alt="" className="m-auto" />
          <p className="text-center fs-5">
            {" "}
            Apakah anda yakin menghapus Activity <span className="fw-bold">"{props.list.title}"</span> ?
          </p>

          <Row className="d-flex gap-2 justify-content-center" data-cy="modal-delete">
            <Button
              data-cy="modal-delete-confirm-button"
              accessKey={props.list.id}
              variant="danger rounded-pill"
              onClick={async (e) => {
                setShowDelete(false);
                var config = {
                  method: "delete",
                  url: `https://todo.api.devcode.gethired.id/todo-items/${props.list.id}`,
                  headers: {},
                };

                await axios(config)
                  .then(function (response) {})
                  .catch(function (error) {});
                props.setshowAlert(true);
                props.setrefresh(!props.refresh);
              }}
            >
              Hapus
            </Button>
            <Button data-cy="modal-delete-cancel-button" variant="secondary rounded-pill" onClick={() => setShowDelete(false)}>
              Batal
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
      {/* End Modal Delete */}

      {/* MODAL EDIT LIST */}
      <Modal show={showEdit} onHide={() => setshowEdit(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={saveEditList}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Edit List Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fw-bold">List Activity Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Enter List"
                name="title"
                value={editList.title}
                onChange={(e) =>
                  seteditList((prev) => {
                    return {
                      ...prev,
                      [e.target.name]: e.target.value,
                    };
                  })
                }
              />
              <Form.Label className="mt-4 fw-bold">Priority</Form.Label>
              <div className="priority-menu">
                <Form.Label className="mt-4 fw-bold">Priority</Form.Label>
                <div className="form-control d-flex align-content-center justify-content-between" onClick={() => setshowPrioritySelect(!showPrioritySelect)}>
                  {prioritySelect}
                  <i className="fi fi-rs-angle-small-down d-flex align-self-center"></i>
                </div>
                {showPrioritySelect ? (
                  <div className="priority-select mt-1">
                    <ul>
                      <li>
                        <div
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            seteditList((prev) => {
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
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            seteditList((prev) => {
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
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            seteditList((prev) => {
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
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            seteditList((prev) => {
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
                          className="form-control"
                          onClick={() => {
                            setshowPrioritySelect(!showPrioritySelect);
                            seteditList((prev) => {
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
            <Button type="submit" onClick={() => setshowEdit(false)} className="button rounded-pill fw-bold" style={{ backgroundColor: "#16abf8", border: "#16abf8", padding: "10px 30px 10px 30px" }}>
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* END MODAL EDIT LIST */}
    </Col>
  );
}

export default ActivityList;
