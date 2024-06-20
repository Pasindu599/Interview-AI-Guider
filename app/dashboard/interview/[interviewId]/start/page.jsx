"use client";
import React from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";

import QuestionsSectoin from "./_components/QuestionsSectoin";
import RecordAnsSection from "./_components/RecordAnsSection";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = React.useState(null);
  const [interviewQuestions, setInterviewQuestions] = React.useState([]);
  const [activeQuestion, setActiveQuestion] = React.useState(0);
  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockInterviewId, params.interviewId));

    const parsedResponse = JSON.parse(result[0].jsonMockResponse);

    setInterviewQuestions(parsedResponse);
    setInterviewData(result[0]);
  };

  React.useEffect(() => {
    getInterviewDetails();
  }, []);

  return (
    <div>
      <div className="grid grid-col-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSectoin
          interviewQuestions={interviewQuestions}
          activeQuestion={activeQuestion}
        />
        {/* video questions */}
        <RecordAnsSection
          interviewQuestions={interviewQuestions}
          activeQuestion={activeQuestion}
          interviewData={interviewData}
        />
      </div>
    </div>
  );
}

export default StartInterview;
