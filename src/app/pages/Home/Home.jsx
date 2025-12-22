import { useState } from "react";
import BlockCard from "../../components/BlockCards/BlockCards";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import SubHeader from "../../components/SubHeader/SubHeader";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  /* 
   Assuming IDs match index + 1 or config:
   1: Home Banner
   2: News Bar Content
   3: Inclusive Community
   4: Explore Meridian
   5: Life at Meridian
   6: Testimonial
   7: School Events
   8: Trusted Collaborators
  */

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="home">
      {isLoading && <Loader />}
      <SubHeader
        title="Customize Home Page"
        showBack={false}
        showRight={false}
      />
      <div className="home_section">      
        <BlockCard title="Home Banner" onClick={() => handleCardClick(1)} />
        <BlockCard title="News Bar" onClick={() => handleCardClick(2)} />
        <BlockCard title="Inclusive Community" onClick={() => handleCardClick(3)} />
        <BlockCard title="Explore Meridian School" onClick={() => handleCardClick(4)} />
        <BlockCard title="Life at Meridian School" onClick={() => handleCardClick(5)} />
        <BlockCard title="Parent Testimonial" onClick={() => handleCardClick(6)} />
        <BlockCard title="School Events" onClick={() => handleCardClick(7)} />
        <BlockCard title="Trusted Collaborators" onClick={() => handleCardClick(8)} /></div>
    </div>
  );
};

export default Home;
