import React from "react";
import { Container, Button, Card, Col, Row, Modal, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Dashboard = () => {
  const [todolist, settodolist] = React.useState([]);
  const [refresh, setrefresh] = React.useState(false);
  const [activity, setActivity] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showAlert, setshowAlert] = React.useState(false);
  const [activityExce, setactivityExce] = React.useState([]);

  const handleClose = () => setShow(false);
  const handleClosedelete = () => setShowDelete(false);
  const handleShow = () => setShow(true);

  React.useEffect(() => {
    getList();
  }, [refresh]);

  const getList = async () => {
    const response = await axios.get("https://todo.api.devcode.gethired.id/activity-groups?email=woberuseless@gmail.com");
    settodolist(response.data.data);
  };

  const addActivity = async (e) => {
    e.preventDefault();

    var data = JSON.stringify({
      title: "New Activity",
      email: "woberuseless@gmail.com",
    });

    var config = {
      method: "post",
      url: "https://todo.api.devcode.gethired.id/activity-groups",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {})
      .catch(function (error) {});

    setActivity("");
    setrefresh(!refresh);
  };

  const deleteActivity = async (e) => {
    var config = {
      method: "delete",
      url: `https://todo.api.devcode.gethired.id/activity-groups/${e.target.accessKey}`,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setrefresh(!refresh);
  };

  console.log(todolist);

  return (
    <Container className="py-5">
      <div className="header d-flex justify-content-between">
        <h1 className="fw-bold fs-1" data-cy="activity-title">
          Activity
        </h1>
        <Button
          data-cy="activity-add-button"
          size="lg"
          className="button rounded-pill fw-bold"
          onClick={(e) => {
            addActivity(e);
            handleClose();
          }}
          style={{ backgroundColor: "#16abf8", border: "#16abf8", padding: "0 30px 0 30px" }}
        >
          + Tambah
        </Button>
      </div>

      <Row className="list-to-do justify-content-start mt-5">
        {/*  alert succes delete */}
        <Alert show={showAlert} variant="success" className="d-flex flex-column justify-content-center" data-cy="modal-information">
          <p style={{ margin: "0" }} className="text-center">
            {" "}
            <span className="fw-bold">"{activityExce.title}"</span> telah dihapus
          </p>
          <div className="d-flex justify-content-end">
            <Button onClick={() => setshowAlert(false)} variant="outline-success">
              Tutup
            </Button>
          </div>
        </Alert>
        {/* End  alert succes delete */}
        {todolist.map((todo) => {
          return (
            <Col className="col-lg-3 col-sm-4 col-12 mb-4 justify-content-start" key={todo.id}>
              <Card className="Small shadow-local activity-card rounded-3" data-cy="activity-card" id={todo.id}>
                <Link data-cy="activity-item" to={`/activity/${todo.id}`} style={{ textDecoration: "none", border: "#16abf8", cursor: "pointer", padding: "0 5px 0 5px", height: "200px" }}>
                  <Card.Body className="activity-body">
                    <Card.Title>
                      {" "}
                      <h2 className="text-dark fs-3 text-start" data-cy="activity-item-title">
                        {todo.title}
                      </h2>{" "}
                    </Card.Title>

                    <Card.Text></Card.Text>
                  </Card.Body>
                </Link>
                <Card.Footer className="d-flex justify-content-between align-content-center ">
                  <p className="text-muted" data-cy="activity-item-date">
                    {moment(todo.created_at).format("D MMMM yy")}
                  </p>
                  {/* <i className="fi fi-rs-trash fs-5 text-muted" data-cy="activity-item-delete-button" style={{ cursor: "pointer" }} onClick={deleteActivity} accessKey={todo.id}></i> */}
                  <i
                    data-cy="activity-item-delete-button"
                    className="fi fi-rs-trash fs-5 text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setactivityExce(todo);
                      setShowDelete(true);
                    }}
                  ></i>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}

        {/* Modal Delete */}
        <Modal data-cy="modal-delete" show={showDelete} onHide={handleClosedelete} aria-labelledby="contained-modal-title-vcenter" className="rounded-3" centered>
          <Modal.Body className="d-flex flex-column justify-content-center">
            <img src="/alert.png" width="100px" alt="" className="m-auto" />
            <p className="text-center fs-5">
              {" "}
              Apakah anda yakin menghapus Activity <span className="fw-bold">"{activityExce.title}"</span> ?
            </p>

            <Row className="d-flex gap-2 justify-content-center" data-cy="modal-delete">
              <Button
                data-cy="modal-delete-confirm-button"
                accessKey={activityExce.id}
                variant="danger rounded-pill"
                onClick={(e) => {
                  setShowDelete(false);
                  deleteActivity(e);
                  setshowAlert(true);
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
      </Row>
    </Container>
  );
};

export default Dashboard;
