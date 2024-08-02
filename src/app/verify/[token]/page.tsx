// User Verification Page

"use client";

import { Results } from "@/lib/models";
import React, { useEffect, useState } from "react";

function Verify({ params }: { params: { token: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: params.token }),
    }).then((res) =>
      res.json().then((data) => {
        if (data?.message === Results.SUCCESS) {
          setIsVerified(true);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
        setMessage(data?.message);
      })
    );
  }, []);
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col mt-20">
        {isSubmitting ? (
          <>
            <p>Verifying ...</p>
          </>
        ) : (
          <>
            {isVerified ? (
              <p className="text-success">Verified successfully</p>
            ) : (
              <p className="text-error">{message}</p>
            )}
            <a href="/">Start Using</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Verify;
