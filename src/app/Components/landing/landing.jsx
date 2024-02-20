import React, { useEffect, useState } from "react";
import {
  useMsalAuthentication,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { QrScanner } from "@yudiel/react-qr-scanner";
import styles from "./landing.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
  Spinner,
} from "@nextui-org/react";

import supabase from "../../../../supabase";

const Landing = () => {
  const [userData, setUserData] = useState([]);
  const [qrStatus, setQrStatus] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [groupId, setGroupId] = useState("");
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalheader, setModalHeader] = useState("");
  const [modaltext, setModalText] = useState("");
  const [selected, setSelected] = useState("environment");
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level

  const { authResult, error } = useMsalAuthentication(InteractionType.Popup, {
    scopes: ["user.read"],
  });

  const checkUser = () => {
    if (isAuthenticated) {
      const currentAccount = instance.getActiveAccount();

      if (currentAccount) {
        console.log(currentAccount);
        setUserData(currentAccount);
        setQrStatus(true);

        return currentAccount;
      }
    } else {
      setModalHeader("QR Scan Status");
      setModalText("You are not signed in. Please Sign in and try again.");
      onOpen();

      console.log("User not found");
    }
  };

  const handleError = (error) => {
    console.log(error);
  };

  const handleScan = (result) => {
    if (result) {
      console.log("qr found");
      const userdata = checkUser();
      console.log(result);

      const { token, coursecode, groupcode } = getTokenFromUrl(result);

      checkTokenValidity(token, userdata, coursecode, groupcode);
    } else {
      console.log("no qr found yet");
    }
  };

  const getTokenFromUrl = (url) => {
    const queryString = url.split("?")[1];
    if (queryString) {
      const queryParams = queryString.split("&");
      let token = null;
      let coursecode = null;
      let groupcode = null;

      for (const param of queryParams) {
        const [key, value] = param.split("=");
        if (key === "token") {
          token = value;
        } else if (key === "coursecode") {
          coursecode = value;
        } else if (key === "groupcode") {
          groupcode = value;
        }
      }

      if (token) {
        console.log("Token:", token);
      }

      if (coursecode) {
        console.log("Course Code:", coursecode);
      }

      if (groupcode) {
        console.log("Group Code:", groupcode);
      }

      return { token, coursecode, groupcode };
    }

    return null;
  };

  const checkTokenValidity = async (token, userdata, coursecode, groupcode) => {
    try {
      const response = await fetch(
        `https://sixc1f0487-145f-4e33-8897-641d33f1d0e6.onrender.com/check_status/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.status);

        if (data.status === "valid") {
          setLoading(true);
          updateData(userdata, coursecode, groupcode, token);

          setModalHeader("QR Scan Status");
          setModalText("You have successfully scanned a Valid QR Code");
          onOpen();
        } else {
          setModalHeader("QR Scan Status");
          setModalText("You have scanned an Invalid QR Code. Try Again !");
          onOpen();

          setQrStatus(false);
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error during token validity check:", error);
    }
  };

  const updateData = async (userdata, coursecode, groupcode, token) => {
    setGroupId(groupcode);
    setCourseId(coursecode);
    console.log(groupcode);
    console.log(coursecode);

    try {
      const { data: savedData, error: saveError } = await supabase
        .from("attendance")
        .insert([
          {
            student_name: userdata.name,
            student_email: userdata.username,
            group_name: groupcode,
            course_id: coursecode,
          },
        ]);

      if (saveError) {
        throw new Error("Error saving data to Supabase:", saveError.message);
      }

      console.log("Data saved to Supabase:", savedData);
      setLoading(false);
    } catch (error) {
      console.error("Error during token validity check:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        backdrop={"blur"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                {modalheader}
              </ModalHeader>
              <ModalBody>
                <p>{modaltext}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {isAuthenticated ? (
        <div>
          {qrStatus ? (
            <div>
              {loading ? (
                <Spinner />
              ) : (
                <div>
                  <div className={styles.heading}>Attendance Details:</div>

                  <div className="max-w-md">
                    <div className="space-y-1">
                      <p className="text-small text-green-500">
                        Your Attendance has been marked !
                      </p>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex-1 h-5 items-center text-small">
                      <div style={{ fontSize: 13 }}>
                        {" "}
                        Name: {userData?.name}
                      </div>
                      <div style={{ marginTop: 5, fontSize: 13 }}>
                        Email: {userData?.username}
                      </div>
                      <div style={{ marginTop: 5, fontSize: 13 }}>
                        Course Code: {courseId}
                      </div>
                      <div style={{ marginTop: 5, fontSize: 13 }}>
                        Group: {groupId}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className={styles.heading}>Scan the QR</h1>
              <p className={styles.subHeading}>
                Hold the camera still for the scanner to work properly
              </p>
              <div className={styles.qrBox}>
                <div className={styles.qr}>
                  <QrScanner
                    delay={100}
                    style={{ width: "100%" }}
                    onError={handleError}
                    // onScan={handleScan}
                    onDecode={(result) => handleScan(result)}
                    constraints={{ 
                      facingMode: "environment",
                      zoom: zoomLevel, // Zoom level
                    }}
                  />
                </div>
              </div>
              {/* Add a zoom control */}
              <input
                type="range"
                min="1"
                max="200"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(e.target.value)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.notLoggedIn}>
          <div>You are not Logged In. Sign In to mark your Attendance.</div>
        </div>
      )}
    </div>
  );
};

export default Landing;