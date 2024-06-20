"use client";
import React from "react";
import { db } from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";

function Interview({ params }) {
  const [interviewData, setInterviewData] = React.useState(null);
  const [webcamEnabled, setWebcamEnabled] = React.useState(false);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockInterviewId, params.interviewId));

    setInterviewData(result[0]);
  };

  React.useEffect(() => {
    getInterviewDetails();
  }, []);

  return (
    <div>
      <div className="flex flex-col mt-2 p-3">
        <span className="font-bold text-lg text-blue-800">
          Boost Your Confidence
        </span>
        <span className="text-sm text-gray-400">
          Experience a range of AI interview questions and scenarios designed to
          prepare you for success.
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {webcamEnabled ? (
          <div
            className="
            flex flex-col
            p-2
            border
            border-gray-200
            rounded-lg
            shadow-md
            bg-gray-50
            mx-2
            mt-4
            mb-3
            h-[80%]
            
            
           
            
            

        "
          >
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="w-full h-full"
              style={{
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col flex-grow gap-3 w-full lg:h-[70%] items-center bg-slate-400 rounded-xl">
            <WebcamIcon className="w-full h-[50%] mt-10" />
            <button
              onClick={() => setWebcamEnabled(true)}
              className="bg-blue-900 text-white font-bold text-md m-2 p-5 rounded-xl cursor-pointer hover:scale-105 hover:bg-slate-600"
            >
              Enable Web Cam & Microphone
            </button>
          </div>
        )}
        <div className="flex flex-grow flex-col p-5 gap-5">
          <div className="flex  flex-col gap-3 border border-gray-500 p-5">
            <span className="text-lg  text-blue-800">
              Job Position : {interviewData?.jobPosition}
            </span>
            <span className="text-lg  text-blue-800">
              Job Description: {interviewData?.jobDiscription}
            </span>

            <span className="text-lg  text-blue-800">
              No. of Years Experience: {interviewData?.jobExperience}
            </span>
          </div>
          <div className="flex flex-col bg-yellow-200 border border-yellow-400 p-5">
            <div className="flex gap-2 text-red-700">
              <Lightbulb></Lightbulb>
              <span>Information</span>
            </div>
            <span className="text-sm text-yellow-800">
              Enable Video Web Cam and Microphone to Start your AI Generated
              Mock Interview, It has 5 question which you can ansvver and at the
              last you will got thc report on the basis of your answer. NOTE:
              Vile never record your video , Web cam access you can disable at
              any time if you want
            </span>
          </div>
          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <button className="p-5 bg-blue-900 text-white hover:bg-slate-500 w-full">
              Start Interview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interview;
