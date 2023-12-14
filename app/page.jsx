"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(false);
  const [finalResponse, setFinalResponse] = useState("");
  const chatNow = (e) => {
    e.preventDefault();
    // Set loading to true when the button is clicked
    setIsLoading(true);
    try {
      fetch("/api/answer-the-question", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }), // Replace with your actual data
      })
        .then((response) => response.json())
        .then((data) => {
          setFinalResponse(data.result);
          console.log(data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
    }
  };
  const getTextOnInput = (e) => {
    setQuestion(e);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10  w-full items-center justify-between font-mono text-sm lg:flex">
        <form className="max-w-2xl mx-auto w-full" onSubmit={chatNow}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Ask me anything...
            </label>
            <input
              onInput={(e) => {
                getTextOnInput(e.target.value);
              }}
              type="text"
              id="large-input"
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-5">
            <Button type="sybmit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </div>

          <div className="w-full rounded-lg border border-gray-200 min-h-[500px] p-3">
            {finalResponse}
          </div>
        </form>
      </div>
    </main>
  );
}
