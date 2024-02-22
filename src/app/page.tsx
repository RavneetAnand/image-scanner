import ImagesTab from "@/components/ImagesTab";
import PredictionsTab from "@/components/PredictionsTab";

const Home: React.FC = () => {
  return (
    <div role="tablist" className="tabs tabs-lifted my-10 lg:mx-10">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Images"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <ImagesTab />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Predictions"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <PredictionsTab />
      </div>
    </div>
  );
};

export default Home;
