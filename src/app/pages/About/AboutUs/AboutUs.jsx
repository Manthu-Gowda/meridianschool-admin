import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="home">
      {isLoading && <Loader />}
      <SubHeader
        title="Customize About Us Page"
        showBack={false}
        showRight={false}
      />
      <div className="home_section">      
        <BlockCard title="About Us - Banner Image" onClick={() => handleCardClick(9)} />
        <BlockCard title="About Meridian School - Content" onClick={() => handleCardClick(10)} />
        <BlockCard title="What Makes Us Unique - Content" onClick={() => handleCardClick(11)} />
        <BlockCard title="The 5E's Model for Learning  - Content" onClick={() => handleCardClick(12)} />
        <BlockCard title="Our Multiple Intelligence - Content" onClick={() => handleCardClick(13)} />
        <BlockCard title="Level 1 Highlights About Meridian - Content" onClick={() => handleCardClick(14)} />
        <BlockCard title="Level 2 Highlights About Meridian - Content" onClick={() => handleCardClick(15)} />
        <BlockCard title="Meridian Achievements" onClick={() => handleCardClick(16)} />

        </div>
    </div>
  );
};

export default AboutUs;
