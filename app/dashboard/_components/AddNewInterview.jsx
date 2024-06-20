"use client";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/router";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <div>
      <div
        className="border p-10 flex items-center justify-center bg-slate-100 hover:shadow-md hover:scale-105 transition-all rounded-xl"
        onClick={() => setOpenDialog(!openDialog)}
      >
        <h2 className="font-bold">+ Add New</h2>
      </div>

      <div
        className={`top-[20%] left-1/2 transform -translate-x-1/2 w-[50%] z-50 p-10 rounded-md shadow-md ${
          openDialog ? `absolute` : `hidden`
        } bg-blue-100`}
      >
        <Header openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </div>
    </div>
  );
}

function Header({ openDialog, setOpenDialog }) {
  const { user } = useUser();

  const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings,
    // See https://ai.google.dev/gemini-api/docs/safety-settings
  });

  const [jobPosition, setJobPosition] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");
  const [yearsOfExperience, setYearsOfExperience] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [interviewQuestions, setInterviewQuestions] = React.useState([]);
  // const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log({
      jobPosition,
      jobDescription,
      yearsOfExperience,
    });

    const inputPrompt =
      (await "Job Position: ") +
      jobPosition +
      ", Job Description: " +
      jobDescription +
      " , Years of Experience: " +
      yearsOfExperience +
      " .Depends on this information please give me " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Interview question with Answered in Json Format, Give Question and Answered as field in JSON";

    console.log(inputPrompt, "inputPrompt");

    const result = await chatSession.sendMessage(inputPrompt);
    const mockjsonresult = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    console.log(mockjsonresult, "mockjsonresult");

    setInterviewQuestions(mockjsonresult);

    let resp = "";

    if (mockjsonresult) {
      resp = await db
        .insert(MockInterview)
        .values({
          jsonMockResponse: mockjsonresult,
          jobPosition: jobPosition,
          jobDiscription: jobDescription,
          jobExperience: yearsOfExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
          mockInterviewId: uuidv4(),
        })
        .returning({
          mockId: MockInterview.mockInterviewId,
        });

      console.log("insered id ", resp);
    } else {
      console.log("No result found");
    }

    const res = await setIsLoading(false);

    if (res) {
      setOpenDialog(false);
      // router.push(`/dashboard/interview/${resp[0]?.mockId}`);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center  ">
        <span className="font-bold text-xl">
          Tell us more about your interview
        </span>
        <IoMdClose
          onClick={() => setOpenDialog(false)}
          className="text-gray-500 cursor-pointer hover:text-gray-800"
        />
      </div>
      <span className="text-gray-500 text-sm">
        Add details about your job position
      </span>
      <form onSubmit={onSubmit}>
        <div className="flex flex-grow flex-col p-2 mb-2">
          <div>
            <label className="text-sm text-gray-500">
              Job Position/ Role Name
            </label>
            <input
              className="w-full p-2  rounded-lg border-none  focus:outline-none"
              placeholder="Enter job title"
              required
              onChange={(e) => setJobPosition(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">
              Job description/ or Tech Stack{" "}
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none"
              rows="3"
              placeholder="Enter job description"
              required
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="text-sm text-gray-500">
              No of Years Experince
            </label>

            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:outline-none"
              placeholder="Enter years of experience required"
              max="50"
              required
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center justify-end flex-grow">
          <button
            type="button"
            className=" p-2 bg-blue-800  rounded-lg text-white hover:bg-blue-950 text-center hover:scale-105"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className=" p-2 bg-blue-800  rounded-lg text-white hover:bg-blue-950 text-center hover:scale-105"
          >
            {isLoading ? (
              <div className="flex gap-2 opacity-50 flex-row">
                <LoaderCircle className="animate-spin flex" size={20} />
                <span>Generating</span>
              </div>
            ) : (
              "Start Interview"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewInterview;
