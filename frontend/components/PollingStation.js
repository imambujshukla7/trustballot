import { get } from "http";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const PollingStation = (props) => {
  const [candidate1URL, changeCandidate1Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );

  const [candidate2URL, changeCandidate2Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );
  // const [candidate1Name, changeCandidate1Name]  = useState("sun");
  // const [candidate2Name, changeCandidate2Name] =  useState("moon");

  const [showresults, changeResultsDisplay] = useState(false);
  const [buttonStatus, changeButtonStatus] = useState(false);
  // for updating the vote count
  const [candidate1Votes, changeVote1] = useState(0);
  const [candidate2Votes, changeVote2] = useState(0);
  const [prompt, changePrompt] = useState("--");

  const contractId = process.env.CONTRACT_NAME;

  useEffect(() => {
    const getInfo = async () => {
      let x = "localstorage";
      console.log("the prompts is", localStorage.prompt);

      //vote count stuff

      let promptName = localStorage.prompt;

      let voteCount = await props.viewMethod("getVotes", {
        prompt: promptName,
      });
      console.log(voteCount);

      changeVote1(voteCount[0]);
      changeVote2(voteCount[1]);

      // image stuff
      console.log(
        "url is ",
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate1"),
        })
      );

      changeCandidate1Url(
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate1"),
        })
      );

      changeCandidate2Url(
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate2"),
        })
      );

      changePrompt(localStorage.getItem("prompt"));

      // vote checking

      let didUserVote = await props.viewMethod("didParticipate", {
        prompt: localStorage.getItem("prompt"),
        user: props.wallet.accountId,
      });
      console.log("did user vote", didUserVote);

      await changeResultsDisplay(didUserVote);
      await changeButtonStatus(didUserVote);
    };
    getInfo();
  }, [showresults]);

  // for voting

  const addVote = async (index) => {
    changeButtonStatus(true);
    let receipt = await props
      .callMethod("addVote", {
        prompt: localStorage.getItem("prompt"),
        index: index,
      })
      .then(async () => {
        console.log("recording a prompt", localStorage.getItem("prompt"));
        console.log("user Account is", props.wallet.accountId);
        await props.callMethod("recordUser", {
          prompt: localStorage.getItem("prompt"),
          user: props.wallet.accountId,
        });
      })
      .then(async () => {
        let voteCount = await props.viewMethod("getVotes", {
          prompt: localStorage.getItem("prompt"),
        });
        return voteCount;
      })
      .then((voteCount) => {
        changeVote1(voteCount[0]);
        changeVote2(voteCount[1]);
        console.log(voteCount);
      })
      .then(() => {
        alert("Thanks for voting!");
      });
    changeResultsDisplay(true);
  };
  return (
    <Container>
      <div className="hactiv-poll">
        <Col className="jutify-content-center d-flex">
          <Container>
            <Row style={{ marginTop: "5vh" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3vw",
                  backgroundColor: "#8C52FF",
                  borderRadius: "30px",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                  }}
                  src={candidate1URL}
                ></img>
              </div>
            </Row>
            {/* {candidate1Name ? (
            <Row style={{ marginTop: "5vh" }}>
                  <div style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2vw",
                  backgroundColor:"#8C52FF",
                  fontSize: "30px",
                  borderRadius:"10px"}}>

                     {candidate1Name}

                  </div>
            </Row>
            ) : null} */}
            <Row
              style={{ marginTop: "5vh", marginBottom: "5vh" }}
              className="justify-content-center d-flex"
            >
              <Button disabled={buttonStatus} onClick={() => addVote(0)}>
                VOTE
              </Button>
            </Row>
            {showresults ? (
              <Row
                className="justify-content-center d-flex"
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "40px",
                    backgroundColor: "#8C52FF",
                    borderRadius: "10px",
                  }}
                >
                  {candidate1Votes}
                </div>
              </Row>
            ) : null}
          </Container>
        </Col>
        <Col className="justify-content-center d-flex align-items-center">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "#8C52FF",
              fontSize: "40px",
              height: "20vh",
              alignItems: "center",
              padding: "2vw",
              textAlign: "center",
            }}
          >
            {prompt}
          </div>
        </Col>
        <Col className="jutify-content-center d-flex">
          <Container>
            <Row style={{ marginTop: "5vh" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3vw",
                  backgroundColor: "#8C52FF",
                  borderRadius: "30px",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                  }}
                  src={candidate2URL}
                ></img>
              </div>
            </Row>
            {/* {candidate2Name ? (
            <Row style={{ marginTop: "5vh" }}>
                  <div style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2vw",
                  backgroundColor:"#8C52FF",
                  fontSize: "30px",
                  borderRadius:"10px"}}>

                     {candidate2Name}

                  </div>
            </Row>

            ) : null} */}
            <Row
              style={{ marginTop: "5vh" }}
              className="justify-content-center d-flex"
            >
              <Button disabled={buttonStatus} onClick={() => addVote(1)}>
                VOTE
              </Button>
            </Row>
            {showresults ? (
              <Row
                className="justify-content-center d-flex"
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "40px",
                    backgroundColor: "#8C52FF",
                    borderRadius: "10px",
                  }}
                >
                  {candidate2Votes}
                </div>
              </Row>
            ) : null}
          </Container>
        </Col>
      </div>
    </Container>
  );
};

export default PollingStation;
