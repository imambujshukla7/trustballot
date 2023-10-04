// import React, { useRef, useState } from "react";
// import { Row, Container, Col, Form, Button, Card } from "react-bootstrap";
// import { Routes, Route, useNavigate } from "react-router-dom";

// import "../assets/global.css";

// const NewPoll = (props) => {
//   const candidateName1 = useRef();
//   const candidateName2 = useRef();

//   const candidateName1URL = useRef();
//   const candidateName2URL = useRef();

//   const promptRef = useRef();

//   const navigate = useNavigate();

//   //state varibles
//   const [disableButton, changeDisable] = useState(false);
//   const [displayMessage, changeDisplayMessage] = useState(false);

//   const sendToBlockChain = async () => {
//     changeDisable(true);
//     await props
//       .callMethod("addCandidatePair", {
//         prompt: promptRef.current.value,
//         name1: candidateName1.current.value,
//         name2: candidateName2.current.value,
//         url1: candidateName1URL.current.value,
//         url2: candidateName2URL.current.value,
//       })
//       .then(
//         async () =>
//           await props.callMethod("addToPromptArray", {
//             prompt: promptRef.current.value,
//           })
//       )
//       .then(async () => {
//         await props.callMethod("initializeVotes", {
//           prompt: promptRef.current.value,
//         });
//         return false;
//       })
//       .then(async () => {
//         props.changePromptList(await props.getPrompts());
//       });
//   };

//   const updatePolls = async () => {
//     await sendToBlockChain().then(changeDisplayMessage(true));
//     navigateHome();
//   };

//   const navigateHome = () => {
//     // 👇️ navigate to /
//     navigate("/");
//   };

//   const returnToHome = () => {
//     if (displayMessage) {
//       return (
//         <Row className="justify-content-center d-flex">
//           {/* <Card style={{ width: "20vw" ,margin: "20px", padding: "10px" ,color: "black"}}>Return to Home Page</Card> */}
//           {alert("Return to home")}
//         </Row>
//       );
//     }
//   };

//   return (
//     <Container
//       className="container-bg"
//       style={{
//         marginTop: "40px",
//         color: "white",
//         fontFamily: "monospace",
//         background: "#8C52FF",
//       }}
//     >
//       {returnToHome()}
//       <Row>
//         <Card
//           className="container-bg"
//           style={{ width: "100rem", background: "#8C52FF" }}
//         >
//           <Card.Body>
//             <Form style={{ color: "white", fontSize: "30px" }}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Provide Poll topic</Form.Label>
//                 <Form.Control
//                   style={{
//                     padding: "10px",
//                     fontSize: "30px",
//                     border: "none",
//                     backgroundColor: "rgb(198, 195, 195)",
//                   }}
//                   ref={promptRef}
//                   placeholder="Poll Question"
//                 ></Form.Control>
//               </Form.Group>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Row>
//       <Row style={{ marginTop: "5px" }}>
//         <Col className="justify-content-center d-flex">
//           <Card
//             className="container-bg"
//             style={{ width: "30rem", background: "#8C52FF" }}
//           >
//             <Card.Body
//               style={{ padding: "10px", fontSize: "30px", border: "none" }}
//             >
//               <Form.Group className="mb-3">
//                 <Form.Label> Provide Candidate 1's Name</Form.Label>
//                 <Form.Control
//                   style={{
//                     padding: "7px",
//                     fontSize: "20px",
//                     backgroundColor: "rgb(198, 195, 195)",
//                   }}
//                   ref={candidateName1}
//                   placeholder="Candidate name"
//                 ></Form.Control>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Candidate 1's Image URL</Form.Label>
//                 <Form.Control
//                   style={{
//                     padding: "7px",
//                     fontSize: "20px",
//                     backgroundColor: "rgb(198, 195, 195)",
//                   }}
//                   ref={candidateName1URL}
//                   placeholder="Candidate Image URL"
//                 ></Form.Control>
//               </Form.Group>
//             </Card.Body>
//           </Card>
//         </Col>
//         {/* // 2nd candidate */}
//         <Col className="justify-content-center d-flex">
//           <Card
//             className="container-bg"
//             style={{ width: "30rem", background: "#8C52FF" }}
//           >
//             {" "}
//             <Card.Body
//               style={{ padding: "10px", fontSize: "30px", border: "none" }}
//             >
//               <Form.Group className="mb-3">
//                 <Form.Label>Provide Candidate 2's Name</Form.Label>
//                 <Form.Control
//                   style={{
//                     padding: "7px",
//                     fontSize: "20px",
//                     backgroundColor: "rgb(198, 195, 195)",
//                   }}
//                   ref={candidateName2}
//                   placeholder="Candidate name"
//                 ></Form.Control>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Candidate 2's Image URL</Form.Label>
//                 <Form.Control
//                   style={{
//                     padding: "7px",
//                     fontSize: "20px",
//                     backgroundColor: "rgb(198, 195, 195)",
//                   }}
//                   ref={candidateName2URL}
//                   placeholder="Candidate Image URL"
//                 ></Form.Control>
//               </Form.Group>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row
//         className="justify-content-center d-flex"
//         style={{ marginTop: "1px", paddingBottom: "50px" }}
//       >
//         <Button
//           style={{
//             width: "350px",
//             padding: "10px",
//             marginTop: "30px",
//             fontSize: "30px",
//             backgroundColor: "#5E17EB",
//             border: "none",
//           }}
//           disabled={disableButton}
//           onClick={updatePolls}
//         >
//           Submit
//         </Button>
//       </Row>
//     </Container>
//   );
// };

// export default NewPoll;
import React, { useRef, useState } from "react";
import { Row, Container, Col, Form, Button, Card } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";

import "../assets/global.css";

const NewPoll = (props) => {
  const candidateName1 = useRef();
  const candidateName2 = useRef();

  const candidateName1URL = useRef();
  const candidateName2URL = useRef();

  const promptRef = useRef();

  const navigate = useNavigate();

  //state varibles
  const [disableButton, changeDisable] = useState(false);
  const [displayMessage, changeDisplayMessage] = useState(false);

  const sendToBlockChain = async () => {
    changeDisable(true);
    await props
      .callMethod("addCandidatePair", {
        prompt: promptRef.current.value,
        name1: candidateName1.current.value,
        name2: candidateName2.current.value,
        url1: candidateName1URL.current.value,
        url2: candidateName2URL.current.value,
      })
      .then(
        async () =>
          await props.callMethod("addToPromptArray", {
            prompt: promptRef.current.value,
          })
      )
      .then(async () => {
        await props.callMethod("initializeVotes", {
          prompt: promptRef.current.value,
        });
        return false;
      })
      .then(async () => {
        props.changePromptList(await props.getPrompts());
      });
  };

  const updatePolls = async () => {
    await sendToBlockChain().then(changeDisplayMessage(true));
    navigateHome();
  };

  const navigateHome = () => {
    // 👇️ navigate to /
    navigate("/");
  };

  const returnToHome = () => {
    if (displayMessage) {
      return (
        <Row className="justify-content-center d-flex">
          {/* <Card style={{ width: "20vw" ,margin: "20px", padding: "10px" ,color: "black"}}>Return to Home Page</Card> */}
          {alert("Return to home")}
        </Row>
      );
    }
  };

  return (
    <Container
      className="container-bg"
      style={{
        width: "100vw",
        marginTop: "40px",
        color: "white",
        fontFamily: "monospace",
        background: "#8C52FF",
      }}
    >
      {returnToHome()}
      <Row>
        <Card
          className="container-bg"
          style={{ width: "100rem", background: "#8C52FF" }}
        >
          <Card.Body>
            <Form style={{ color: "white", fontSize: "30px" }}>
              <Form.Group className="mb-3">
                <Form.Label>Provide Poll topic</Form.Label>
                <Form.Control
                  style={{
                    padding: "10px",
                    fontSize: "30px",
                    border: "none",
                    backgroundColor: "rgb(198, 195, 195)",
                  }}
                  ref={promptRef}
                  placeholder="Poll Question"
                ></Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Row>
      <Row style={{ marginTop: "5px" }}>
        <Col className="justify-content-center d-flex">
          <Card
            className="container-bg"
            style={{ width: "30rem", background: "#8C52FF" }}
          >
            <Card.Body
              style={{ padding: "10px", fontSize: "30px", border: "none" }}
            >
              <Form.Group className="mb-3">
                <Form.Label> Provide Candidate 1's Name</Form.Label>
                <Form.Control
                  style={{
                    padding: "7px",
                    fontSize: "20px",
                    backgroundColor: "rgb(198, 195, 195)",
                  }}
                  ref={candidateName1}
                  placeholder="Candidate name"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Candidate 1's Image URL</Form.Label>
                <Form.Control
                  style={{
                    padding: "7px",
                    fontSize: "20px",
                    backgroundColor: "rgb(198, 195, 195)",
                  }}
                  ref={candidateName1URL}
                  placeholder="Candidate Image URL"
                ></Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        {/* // 2nd candidate */}
        <Col className="justify-content-center d-flex">
          <Card
            className="container-bg"
            style={{ width: "30rem", background: "#8C52FF" }}
          >
            {" "}
            <Card.Body
              style={{ padding: "10px", fontSize: "30px", border: "none" }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Provide Candidate 2's Name</Form.Label>
                <Form.Control
                  style={{
                    padding: "7px",
                    fontSize: "20px",
                    backgroundColor: "rgb(198, 195, 195)",
                  }}
                  ref={candidateName2}
                  placeholder="Candidate name"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Candidate 2's Image URL</Form.Label>
                <Form.Control
                  style={{
                    padding: "7px",
                    fontSize: "20px",
                    backgroundColor: "rgb(198, 195, 195)",
                  }}
                  ref={candidateName2URL}
                  placeholder="Candidate Image URL"
                ></Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row
        className="justify-content-center d-flex"
        style={{ marginTop: "1px", paddingBottom: "50px" }}
      >
        <Button
          style={{
            width: "350px",
            padding: "10px",
            marginTop: "30px",
            fontSize: "30px",
            backgroundColor: "#5E17EB",
            border: "none",
          }}
          disabled={disableButton}
          onClick={updatePolls}
        >
          Submit
        </Button>
      </Row>
    </Container>
  );
};

export default NewPoll;
