"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Icon } from "@iconify/react";
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("who are you?");
  const [finalResponse, setFinalResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [base64ImageFull, setFullBase64Image] = useState(null);

  const chatNow = (e) => {
    e.preventDefault();
    if (!question || question.length <= 0) {
      return;
    }
    // Set loading to true when the button is clicked
    setIsLoading(true);
    try {
      let payload = {};
      if (base64Image) {
        payload = {
          question: question,
          image: base64Image,
          image_type: imageType,
        };
      } else {
        payload = {
          question: question,
        };
      }
      fetch("/api/answer-the-question", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Replace with your actual data
      })
        .then((response) => response.json())
        .then((data) => {
          setFinalResponse(data.result);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
    } finally {
    }
  };
  const handleFileChange = async (event) => {
    if (event.target.files[0]) {
      const preview = URL.createObjectURL(event.target.files[0]);
      setFile(preview);
      let base64String = await convertImageToBase64(event.target.files[0]);
      setFullBase64Image(base64String);
      setBase64Image(base64String.split(",")[1]);
      const mimeType = getFileMimeType(event.target.files[0]);
      setImageType(mimeType);
    }
  };
  const getFileMimeType = (file) => {
    const mimeType = file.type;
    return mimeType;
  };
  const getTextOnInput = (e) => {
    setQuestion(e);
  };
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(imageFile);
    });
  };
  const clearImage = () => {
    setBase64Image(null);
    setFile(null);
    setImageType(null);
    setFullBase64Image(null);
    const inputElement = document.getElementById("imageInput");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 lg:p-24">
      <div className="z-10  w-full items-center justify-between font-mono text-sm lg:flex">
        <form className="lg:max-w-2xl mx-auto w-full" onSubmit={chatNow}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Ask me anything...
            </label>
            <div className="flex gap-2 ">
              <input
                onInput={(e) => {
                  getTextOnInput(e.target.value);
                }}
                value="who are you?"
                type="text"
                id="prompt-input"
                className="w-[75%] block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input
                onChange={(e) => {
                  handleFileChange(e);
                }}
                type="file"
                id="imageInput"
                className="block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-5">
            <Button type="sybmit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </div>
          {base64ImageFull && (
            <div className="relative max-w-fit m-auto">
              <img
                src={base64ImageFull}
                alt="Converted to Base64"
                className="h-[150px]  rounded-sm my-2"
              />
              <div
                onClick={() => {
                  clearImage();
                }}
                className="absolute -right-3 -top-3 p-1 rounded-lg bg-gray-200 cursor-pointer shadow-md  hover:shadow-2xl   text-lg hover:text-xl text-red-300 hover:text-red-500 "
              >
                <Icon icon="ph:x-bold" />
              </div>
            </div>
          )}

          <div className="w-full rounded-lg border border-gray-200 min-h-[500px] p-3">
            {finalResponse}
          </div>
        </form>
      </div>
    </main>
  );
}
