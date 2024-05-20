// Inbox.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Inbox = ({ accessToken }) => {
  console.log("AccessToken is ", accessToken);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/gmail/v1/users/me/messages",
          //   "https://gmail.googleapis.com/gmail/v1/users/sandeepchandran.work@gmail.com/messages",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Extract relevant information from the response
        const emailList = response.data.messages;
        setEmails(emailList);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    if (accessToken) {
      fetchEmails();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
