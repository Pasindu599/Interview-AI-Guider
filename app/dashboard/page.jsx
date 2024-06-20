import React from "react";
import AddNewInterview from "./_components/AddNewInterview";

function Dashboard() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-lg">Dashboard</h2>
      <h3 className="text-sm text-gray-500">Welcome to Interview AI</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>
    </div>
  );
}

export default Dashboard;
