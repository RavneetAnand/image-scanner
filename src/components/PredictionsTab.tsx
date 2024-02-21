import React, { useEffect, useState } from "react";

type Prediction = {
  id: number;
  title: string;
  description: string;
  timestamp: string;
};

const PredictionsTab: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Fetch predictions from the JSON server or backend
    const fetchPredictions = async () => {
      try {
        const response = await fetch("http://localhost:3000/predict");
        if (response.ok) {
          const data = await response.json();

          setPredictions(data);
        }
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="p-5 border-t border-gray-400">
      <div className="overflow-x-auto mt-3 shadow-md border border-gray-400">
        <table className="w-full text-left bg-blue-50">
          <thead className="bg-blue-200">
            <tr className="border-b border-gray-600">
              <th>Title</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.id}>
                <td>{prediction.title}</td>
                <td>{prediction.description}</td>
                <td>{new Date(prediction.timestamp).toLocaleString()}</td>
                <td>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold mt-1 mb-1 py-0.5 px-2 rounded"
                    onClick={() =>
                      alert(`Viewing prediction: ${prediction.title}`)
                    }
                  >
                    VIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionsTab;
