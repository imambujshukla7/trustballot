import "regenerator-runtime/runtime";
import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import voteVideo from "./resource/PinkLogo.png";
import votehand from "./resource/votehand.png";
import votehand1 from "./resource/voteHand1.png";
import votedata from "./resource/votedata.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

//Components
import Home from "./components/Home";
import NewPoll from "./components/NewPoll";
import PollingStation from "./components/PollingStation";

export default function App({ isSignedIn, contractId, wallet }) {
  let [promptList, changePromptList] = useState([]);
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  let callMethod = async (methodName, args = {}) => {
    wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  let viewMethod = async (methodName, args = {}) => {
    return await wallet.viewMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  let signInFun = () => {
    wallet.signIn();
  };

  let signOutFun = () => {
    wallet.signOut();
  };

  let getPrompts = async () => {
    return await viewMethod("getAllPrompts");
  };

  let displayHome = () => {
    if (isSignedIn) {
      return (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
                changeCandidates={changeCandidatesFunction}
                getPrompts={getPrompts}
                promptList={promptList}
                changePromptList={changePromptList}
              />
            }
          ></Route>
          <Route
            path="/newpoll"
            element={
              <NewPoll
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
                getPrompts={getPrompts}
                promptList={promptList}
                changePromptList={changePromptList}
              />
            }
          ></Route>
          <Route
            path="/pollingstation"
            element={
              <PollingStation
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
              />
            }
          ></Route>
        </Routes>
      );
    } else {
      return (
        <div>
          <section style={{ background: "#9340FF" }}>
            <Container
              style={{
                marginTop: "150px",
              }}
              className="container-hactiv "
            >
              <div className="hactiv-row">
                <h1
                  className="hactiv-h1"
                  style={{
                    color: "white",
                    fontSize: "100px",
                  }}
                >
                  Trust
                </h1>
                <h1
                  className="hactiv-h1"
                  style={{ color: "white", fontSize: "100px" }}
                >
                  The Ballot.
                </h1>
                <button
                  className="hactiv-button"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "https://drive.google.com/drive/folders/1wKk7P55pKmXxlRJSi0hkyuDC99a5l9lp?usp=sharing";
                  }}
                  style={{
                    marginTop: "130px",

                    padding: "20px 5px",
                    borderRadius: "50px",
                    border: "none",
                    width: "266.4px",
                    fontSize: "25px",
                  }}
                >
                  Watch Tutorial
                </button>
              </div>

              <Image
                style={{ filter: "drop-shadow(2px -1px 20px #CE43AB)" }}
                className="b-img1"
                src={voteVideo}
              />
            </Container>
          </section>

          <section
            style={{
              background: "#5E17EB",
              width: "100%",
              height: "100%",
              textAlign: "center",
              paddingBottom: "150px",
            }}
          >
            <Container>
              <h1
                style={{
                  fontSize: "50px",
                  paddingTop: "150px",

                  color: "#FFFFFF",
                }}
              >
                {" "}
                <a style={{ color: "black" }}>TrustBallot</a>, a highly advanced
              </h1>
              <h1 style={{ fontSize: "50px", color: "#FFFFFF" }}>
                blockchain-based e-voting platform, has the potential to
                revolutionize the election process
              </h1>

              <div style={{ wordSpacing: "7px", lineHeight: "20px" }}>
                <p
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: "80%",
                    fontSize: "20px",
                    color: "#FFFFFF",
                    paddingTop: "50px",
                    lineHeight: "40px",
                  }}
                >
                  Utilizing cutting-edge technologies such as blockchain, it
                  offers unparalleled security and transparency by providing
                  secure storage and tamper-proofing measures. Its decentralized
                  architecture enables direct, transparent transactions.
                </p>

                <p style={{ fontSize: "20px", color: "#FFFFFF" }}>
                  <a
                    style={{ color: "#FFFFFF", textDecoration: "none" }}
                    href="https://www.linkedin.com/in/imambuj/"
                  >
                    TrustBallot creator : Ambuj Shukla{" "}
                  </a>
                </p>
              </div>
            </Container>
          </section>

          <section
            style={{
              width: "100%",
              textAlign: "left",
              marginTop: "100px",
            }}
          >
            <Container className="container-hactiv1">
              <div
                style={{
                  color: "white",

                  lineHeight: "25px",
                }}
              >
                <h1 style={{ fontSize: "80px" }}>Next-Level</h1>
                <h1 style={{ fontSize: "80px" }}>Voting Integrity</h1>

                <p
                  style={{
                    fontSize: "25px",
                    paddingTop: "50px",
                    lineHeight: "40px",
                    maxWidth: "90%",
                  }}
                >
                  TrustBallot implements advanced voting mechanisms to ensure
                  that only eligible, registered voters can cast their vote,
                  preventing any potential voter fraud. <br />
                  <br /> This solution is highly adaptable, can be uilized for a
                  variety of purposes, from simple polls to complex elections,
                  making it a reliable and efficient voting solution
                </p>
              </div>

              <Image
                className="b-img1"
                style={{ maxWidth: "90%" }}
                src={votedata}
              />
            </Container>
          </section>
          <section className="hactiv-footer" style={{ paddingBottom: "100px" }}>
            <div
              style={{
                padding: "40px",
                display: "inline-flex",
                float: "left",
                color: "white",
                paddingTop: "100px",
              }}
            >
              <Image
                style={{
                  height: "55px",
                  paddingRight: "10px",
                }}
                src={votehand1}
              />
              <h1>TrustBallot</h1>
            </div>
            <div
              style={{
                float: "right",
                color: "white",
                paddingTop: "40px",
                textAlign: "left",
                maxWidth: "90%",
              }}
            >
              <h1 style={{ fontSize: "40px" }}>
                <a
                  style={{
                    color: "#FF3C5F",
                    textDecoration: "none",
                    fontWeight: "bold",
                    maxWidth: "90%",
                  }}
                  href=""
                >
                  HacktivSpace Community
                </a>
              </h1>
              <p
                style={{
                  fontSize: "24px",
                  wordSpacing: "8px",
                  maxWidth: "90%",
                }}
              >
                A space for developers to thrive and make a difference
              </p>

              <p
                style={{
                  fontSize: "20px",
                  wordSpacing: "8px",
                  maxWidth: "90%",
                }}
              >
                TrustBallot Creator :&nbsp;
                <a
                  style={{ color: "#FF3C5F", textDecoration: "none" }}
                  href="https://www.linkedin.com/in/imambuj/"
                >
                  Ambuj Shukla
                </a>
              </p>

              <div
                style={{
                  paddingTop: "70px",
                  textAlign: "center",
                  display: "flex",
                }}
              >
                <a href="https://www.linkedin.com/company/hacktivspace-community/mycompany/">
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    style={{ color: "FF3C5F", marginRight: "100px" }}
                    size="2xl"
                  />
                </a>
                <a href="https://www.instagram.com/hacktivspace/">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    style={{ color: "FF3C5F", marginRight: "100px" }}
                    size="2xl"
                  />
                </a>
                <a href="https://twitter.com/hacktivspace">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={{ color: "FF3C5F", marginRight: "" }}
                    size="2xl"
                  />
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }
  };

  let changeCandidatesFunction = async (prompt) => {
    console.log(prompt);
    let namePair = await viewMethod("getCandidatePair", { prompt: prompt });
    await localStorage.setItem("Candidate1", namePair[0]);
    await localStorage.setItem("Candidate2", namePair[1]);
    await localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "PollingStation");
  };

  return (
    <Router>
      {/* <Navbar className="nav-bar" variant="dark">
        {console.log("contract account is", isSignedIn)}
        <Container>
          <Navbar.Brand
            href="/"
            className="justify-content-center d-flex"
            style={{ marginTop: "15px" }}
          >
            <Image
              style={{ height: "50px", paddingRight: "10px" }}
              src={votehand}
            />
            <h1>TrustBallot</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto"></Nav>
            <Nav>
              <Nav.Link href="/"> Home</Nav.Link>
              <Nav.Link disabled={!isSignedIn} href="/newpoll">
                New Poll
              </Nav.Link>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <Navbar className="nav-bar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <Image
              style={{ height: "50px", paddingRight: "10px" }}
              src={votehand}
              alt="Logo"
            />
            <h1>TrustBallot</h1>
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={toggleNav}
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className={showNav ? "show" : ""}
          >
            <Nav className="mx-auto">
              {/* Add your navigation links here */}
            </Nav>
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link disabled={!isSignedIn} href="/newpoll">
                New Poll
              </Nav.Link>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {displayHome()}
    </Router>
  );
}
