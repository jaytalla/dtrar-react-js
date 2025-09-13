import React from 'react'

function Dashboard({ tasks }) {
  return (
    <>
        {/* Dashboard Header */}
        <div className="w-full h-[20%] bg-amber-50 rounded-md p-4 flex flex-col justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start">
                <h2 className="text-sm font-semibold text-gray-500">Total Tasks</h2>
                <p className="text-2xl font-bold text-gray-800 mt-2">{tasks.length}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start">
                <h2 className="text-sm font-semibold text-gray-500">Completed</h2>
                <p className="text-2xl font-bold text-green-600 mt-2">
                {tasks.filter((t) => t.isOT === false).length}
                </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start">
                <h2 className="text-sm font-semibold text-gray-500">OT Tasks</h2>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                {tasks.filter((t) => t.isOT === true).length}
                </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start">
                <h2 className="text-sm font-semibold text-gray-500">Today</h2>
                <p className="text-2xl font-bold text-amber-600 mt-2">
                {tasks.filter((t) => t.date === new Date().toISOString().split("T")[0]).length}
                </p>
            </div>
        </div>
    </>
  )
}

export default Dashboard