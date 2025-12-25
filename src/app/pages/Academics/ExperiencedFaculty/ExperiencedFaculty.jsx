import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExperiencedFaculty.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";
import { contentTypeConfig } from "../../../helpers/contentConstant";

const ExperiencedFaculty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="experienced-faculty page">
      {isLoading && <Loader />}
      <SubHeader title="Customize Experienced Faculty" showBack={false} showRight={false} />
      <div className="home_section">
        <div className="home_section">
          {contentTypeConfig
            .filter((item) => item.typeId >= 37 && item.typeId <= 44)
            .map((item) => (
              <BlockCard
                key={item.typeId}
                title={item.typeName}
                onClick={() => handleCardClick(item.typeId)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencedFaculty;
