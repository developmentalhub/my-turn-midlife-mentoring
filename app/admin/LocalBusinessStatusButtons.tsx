"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

export default function LocalBusinessStatusButtons({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState<
    string | null
  >(null);

  const [
    message,
    setMessage,
  ] = useState("");

  async function changeStatus(
    status:
      | "pending"
      | "approved"
      | "rejected"
  ) {
    setLoading(status);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/local-business-status",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,
              status,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Business status update error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-3">
        <span
          className={[
            "inline-flex rounded-full px-4 py-2 text-xs font-semibold",
            currentStatus ===
            "approved"
              ? "bg-[#dcecdf] text-[#426552]"
              : currentStatus ===
                "rejected"
              ? "bg-[#f4ece8] text-[#815f55]"
              : "bg-[#edf5f7] text-[#607982]",
          ].join(" ")}
        >
          {currentStatus ===
          "approved"
            ? "Approved"
            : currentStatus ===
              "rejected"
            ? "Rejected"
            : "Pending review"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={
            loading !== null ||
            currentStatus ===
              "approved"
          }
          onClick={() =>
            changeStatus(
              "approved"
            )
          }
          className={[
            "rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed",
            currentStatus ===
            "approved"
              ? "bg-[#284f5d] text-white opacity-100"
              : "bg-[#e4f0e8] text-[#426552] hover:bg-[#d8eadf]",
          ].join(" ")}
        >
          {loading ===
          "approved"
            ? "Approving..."
            : currentStatus ===
              "approved"
            ? "Approved ✓"
            : "Approve"}
        </button>

        <button
          type="button"
          disabled={
            loading !== null ||
            currentStatus ===
              "rejected"
          }
          onClick={() =>
            changeStatus(
              "rejected"
            )
          }
          className={[
            "rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed",
            currentStatus ===
            "rejected"
              ? "bg-[#815f55] text-white opacity-100"
              : "bg-[#f4ece8] text-[#815f55]",
          ].join(" ")}
        >
          {loading ===
          "rejected"
            ? "Rejecting..."
            : currentStatus ===
              "rejected"
            ? "Rejected"
            : "Reject"}
        </button>

        <button
          type="button"
          disabled={
            loading !== null ||
            currentStatus ===
              "pending"
          }
          onClick={() =>
            changeStatus(
              "pending"
            )
          }
          className={[
            "rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed",
            currentStatus ===
            "pending"
              ? "bg-[#607982] text-white opacity-100"
              : "bg-white text-[#607982] ring-1 ring-[#dce5e7]",
          ].join(" ")}
        >
          {loading ===
          "pending"
            ? "Updating..."
            : currentStatus ===
              "pending"
            ? "Pending"
            : "Move to pending"}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-xs font-medium text-[#815f55]">
          {message}
        </p>
      )}
    </div>
  );
}