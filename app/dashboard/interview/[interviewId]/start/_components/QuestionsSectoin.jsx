import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSectoin({ interviewQuestions, activeQuestion }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);
      synth.speak(utterThis);
    } else {
      alert("Your browser does not support text to speech");
    }
  };
  return (
    interviewQuestions && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {interviewQuestions &&
            interviewQuestions.map((question, index) => {
              return (
                <h2
                  className={`p-2  rounded-full text-xs md:text-sm text-center cursor-pointer ${
                    activeQuestion === index
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Q{index + 1}
                </h2>
              );
            })}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {interviewQuestions[activeQuestion]?.Question}
        </h2>
        <Volume2
          className="cursor-pointer text-blue-800 hover:text-blue-900"
          onClick={() =>
            textToSpeech(interviewQuestions[activeQuestion]?.Question)
          }
        />
        <div className="border rounded-lg p-5 bg-blue-200 mt-20">
          <h2 className="flex gap-2 text-center text-blue-800">
            <Lightbulb />
            <strong>Note: </strong>
          </h2>
          <h2 className="text-sm text-blue-800 my-2 ">
            Click on Record Answer when you want to answer the question, At the
            end of interview we will give you the feedback along with correct
            answer for each of question and your answer to comapre it.
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSectoin;
