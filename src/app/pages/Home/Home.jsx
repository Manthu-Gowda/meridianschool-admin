import { useState } from "react";
import BlockCard from "../../components/BlockCards/BlockCards";
import Loader from "../../components/Loader/Loader";
import "./Home.scss";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  
  const handleCardClick = () => {
    alert("Card clicked!");
  };

  return (
    <div className="home">
      {isLoading && <Loader />}
      <BlockCard title="Welcome Popup" onClick={handleCardClick} />
      <BlockCard title="Another Card" onClick={handleCardClick} />
    </div>
  );
};

export default Home;
