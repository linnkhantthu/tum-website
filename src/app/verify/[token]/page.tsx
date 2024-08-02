"use client";

import { Results } from "@/lib/models";
import React, { useEffect, useState } from "react";

function Verify({ params }: { params: { token: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: params.token }),
    }).then((res) =>
      res.json().then((data) => {
        console.log(data?.message);
        if (data?.message === Results.SUCCESS) {
          setIsVerified(true);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      })
    );
  }, []);
  return (
    <div>
      {isSubmitting ? (
        <>
          <p>Verifying ...</p>
        </>
      ) : (
        <>
          {isVerified ? (
            <p className="text-success">Verified successfully</p>
          ) : (
            <p className="text-error">The token is expired</p>
          )}
          <a href="/">Start Using</a>
        </>
      )}
    </div>
  );
}

export default Verify;
