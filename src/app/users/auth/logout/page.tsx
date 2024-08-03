"use client";
import Loading from "@/app/components/Loading";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Logout() {
  const { mutateUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState<string>();

  const { push } = useRouter();
  const logoutUser = async () => {
    const res = await fetch("/api/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      await mutateUser([]);
      return true;
    }
    const { message } = await res.json();
    setMsg(message);
    return false;
  };
  useEffect(() => {
    logoutUser().then((result) => {
      if (result) {
        setIsLoading(!result);
      } else {
        setTimeout(() => push("/"), 3000);
      }
    });
  }, []);
  return isLoading ? (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col mt-10">
        <Loading label={msg ? msg : "Logging Out..."} />
      </div>
    </div>
  ) : (
    push("/")
  );
}

export default Logout;
