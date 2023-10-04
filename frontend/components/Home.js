import React, { useState, useEffect } from "react";
import { Table, Container, Button, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

import { async } from "regenerator-runtime";

let contractId = process.env.CONTRACT_NAME;
console.log(contractId);

const Home = (props) => {
  const [disableButton, changeDisableButton] = useState(false);
  //   const [promptList, changePromptList] = useState([]);

  useEffect(() => {
    console.log("loading prompt");
    const getInfo = async () => {
      let output = await props.getPrompts();
      props.changePromptList(output);
      if (output.length === 0) {
        changeDisableButton(true);
      }
    };
    getInfo();
  }, []);

  const clearPolls = async () => {
    await props.callMethod("clearPromptArray");
    changeDisableButton(true);
    alert("Please Reload the Page");
  };

  const addPrompt = async () => {
    await props.callMethod("addToPromptArray", {
      prompt: "munish",
    });
    console.log("adding prompts");
  };

  return (
    <Container
      style={{
        maxWidth: "100%",
        padding: "20px",
      }}
    >
      <Table
        style={{
          margin: "auto",
          maxWidth: "90vw",

          backgroundColor: "#9f80bb",
          fontSize: "25px",
        }}
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Poll No.</th>
            <th>Poll list</th>
            <th>Poll link</th>
          </tr>
        </thead>
        <tbody>
          {props.promptList.map((el, index) => {
            console.log(props.promptList);
            if (props.promptList) {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{el}</td>
                  <td>
                    {" "}
                    <FontAwesomeIcon
                      icon={faFolder}
                      style={{ color: "0042aa", marginRight: "10px" }}
                      size="2xl"
                    />
                    <Button
                      style={{
                        backgroundColor: "rgb(184, 182, 182)",
                        padding: "5px",
                        fontSize: "20px",
                      }}
                      variant="outline-primary"
                      onClick={() => {
                        console.log("clickedd");
                        props.changeCandidates(el);
                      }}
                    >
                      Vist Poll
                      {console.log(el)}
                    </Button>
                  </td>
                </tr>
              );
            } else {
              <tr>
                <td> no prompts</td>
              </tr>;
            }
          })}
        </tbody>
      </Table>
      {/* {
            <Row className = 'justify-content-center d-flex'>
                <Card style={{width:'30vh',height:'5vh' , textAlign:'center', fontSize:'25px'}}>
                    No prompts to show 
                </Card>
            </Row>
        } */}
      <Row className="justify-content-center d-flex">
        <Button
          style={{
            width: "350px",
            padding: "10px",
            marginTop: "30px",
            fontSize: "30px",
            backgroundColor: "rgba(43, 43, 138, 0.778)",
          }}
          onClick={clearPolls}
          disabled={disableButton}
        >
          {" "}
          Clear polls
        </Button>{" "}
      </Row>
    </Container>
  );
};

export default Home;
