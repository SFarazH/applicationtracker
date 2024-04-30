import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import { FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import { RiAddCircleLine, RiCloseCircleLine } from "react-icons/ri";

export default function Notes() {
  const cookies = new Cookies();
  const token = cookies.cookies.TOKEN;

  const [note, setNote] = useState("");
  const [displayForm, setDisplay] = useState(false);
  const [notesArr, setNotesArr] = useState([]);
  const email = sessionStorage.getItem("email");
  const [submit, addSubmit] = useState(0);
  const [addBtn, toggleBtn] = useState(false);

  useEffect(() => {
    // console.log("called");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get("http://localhost:8257/user/notes/get", config).then((res) => {
      setNotesArr((prev) => [...res.data.notes]);
      console.log(res.data.notes);
    });
  }, [submit, email]);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return; // Prevent adding empty notes

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "post",
      url: "http://localhost:8257/user/notes/add",
      data: {
        note: note,
      },
    };

    axios(config)
      .then((res) => {
        setNotesArr((prevNotes) => [...prevNotes, note]);
        addSubmit((prev) => prev + 1);
      })
      .catch((error) => console.log(error));
    setNote("");
    setDisplay(false);
  };

  const deleteNote = (id) => {
    const config = {
      data: { noteId: id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "patch",
      url: "http://localhost:8257/user/notes/rem",
    };
    axios(config)
      .then((res) => addSubmit((prev) => prev - 1))
      .catch((error) => console.log(error));
  };

  const displayNotes = () => {
    return notesArr.map((note) => (
      <div key={note.noteId} className="card position-relative my-2 notes">
        <div className="card-body pt-4">
          <p className="card-text">{note.note}</p>
        </div>
        <button
        color="#ED1B24"
          onClick={() => deleteNote(note.noteId)}
          className="delete-btn position-absolute top-0 end-0"
        >
          ×
        </button>
      </div>
    ));
  };

  return (
    <>
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{ color: "white", fontSize: "1.5em" }}
            />
            <h3 className="t-white mb-0 mx-2">Notes</h3>
          </div>

          {displayForm ? (
            <RiCloseCircleLine
              onClick={() => {
                setDisplay(false);
              }}
              size="1.8em"
              cursor="pointer"
              color="#FFD700"
            />
          ) : (
            <RiAddCircleLine
              onClick={() => {
                setDisplay(true);
              }}
              size="1.8em"
              cursor="pointer"
              color="yellow"
            />
          )}
        </div>
        {displayForm && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="noteTextarea">
              <Form.Label className="t-white">Add Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={note}
                onChange={handleChange}
              />
            </Form.Group>
            <Button className="mt-1" id="addNote" type="submit">
              Add
            </Button>
          </Form>
        )}
        {displayNotes()}
      </div>
    </>
  );
}
