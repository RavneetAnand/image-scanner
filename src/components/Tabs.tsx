"use client";

import ImagesTab from "@/components/ImagesTab";
import PredictionsTab from "@/components/PredictionsTab";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

enum Tab {
  IMAGES = "images",
  PREDICTIONS = "predictions",
}

const Tabs: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Assume tabs are identified by 'tab' query parameter (e.g., ?tab=images)
  const initialTab = searchParams.get("tab") || Tab.IMAGES;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Client-side tab switching logic
  const switchTab = (newTab: Tab) => {
    setActiveTab(newTab);

    router.push(`/?tab=${newTab}`);
  };

  // Component for tab content
  const TabContent = () => {
    switch (activeTab) {
      case Tab.IMAGES:
        return <ImagesTab />;
      case Tab.PREDICTIONS:
        return <PredictionsTab />;
    }
  };

  const isActiveTab = (tab: Tab) => activeTab === tab;

  return (
    <div className="h-screen flex flex-col text-sm">
      <div className="flex flex-row">
        <button
          className={`mt-5 ml-2 bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 ${
            isActiveTab(Tab.IMAGES)
              ? "border-b-2 border-blue-500 bg-gray-200"
              : ""
          } rounded-t border border-gray-500`}
          onClick={() => switchTab(Tab.IMAGES)}
        >
          Images
        </button>
        <button
          className={`mt-5 bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 ${
            isActiveTab(Tab.PREDICTIONS)
              ? "border-b-2 border-blue-500 bg-gray-200"
              : ""
          } rounded-t border border-gray-500`}
          onClick={() => switchTab(Tab.PREDICTIONS)}
        >
          Predictions
        </button>
      </div>

      <TabContent />
    </div>
  );
};

export default Tabs;
