"use client";
import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic2, StopCircle } from "lucide-react";
import { is } from "drizzle-orm";
import { chatSession } from "../../../../../../utils/GeminiAIModel";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnsSection({
  interviewQuestions,
  activeQuestion,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = React.useState("");
  const { user } = useUser();
  const [loading, setLoading] = React.useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const saveUserAnswser = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        alert("Please speak more than 10 words");
        return;
      }

      const feedbackPrompt =
        "Question :" +
        interviewQuestions[activeQuestion]?.Question +
        ", Answer : " +
        userAnswer +
        ", Depending on question and user answer for give interview question please give us  rating for and feedback as area of imporvement if any in just three to five lines to imporve it in JSON format with rating field and feedback field";
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResponse = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(mockJsonResponse, "mockJsonResponse");

      const jsonFeeedbackResponse = JSON.parse(mockJsonResponse);

      const res = await db.insert(UserAnswer).values({
        question: interviewQuestions[activeQuestion]?.Question,
        userAnswer: userAnswer,
        correctAnswer: interviewQuestions[activeQuestion]?.Answer,
        feedback: jsonFeeedbackResponse?.feedback,
        rating: jsonFeeedbackResponse?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
        mockIdRef: interviewData?.mockInterviewId,
      });

      alert("Answer Recorded Successfully");
      setUserAnswer("");
      setLoading(false);
    } else {
      startSpeechToText();
    }
  };

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);
  return (
    <div className="flex flex-col  items-center justify-center">
      <div className="flex flex-col justify-center  items-center bg-blue-100    rounded-lg p-5 mt-20 ">
        <Image
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYnOmiQJzDK75wrB7lGxgoIQb439CFESXM3Q&s"
          }
          width={200}
          height={200}
          className="absolute z-0"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <button
        disabled={loading}
        className="bg-blue-900 text-white my-10 p-3 rounded-lg hover:bg-slate-500 "
        onClick={saveUserAnswser}
      >
        {isRecording ? (
          <h2 className="flex gap-2 text-red-500">
            <StopCircle />
            Stop Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </button>

      <button
        className="bg-blue-900 text-white my-10 p-3 rounded-lg hover:bg-slate-500 "
        onClick={() => console.log(userAnswer)}
      >
        Submit Answer
      </button>
    </div>
  );
}

export default RecordAnsSection;
