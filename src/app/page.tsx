import ImagesTab from "@/components/ImagesTab";

const Home: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 m-4 w-full">
        <div className="flex items-center justify-between mb-4 bg-blue-500 py-3 rounded">
          <h1 className="text-xl font-semibold text-white px-2">Image Scanner</h1>
        </div>
        <ImagesTab />
      </div>
    </div>
  );
};

export default Home;
