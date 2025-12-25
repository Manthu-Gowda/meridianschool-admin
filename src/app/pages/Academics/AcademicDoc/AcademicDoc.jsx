import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcademicDoc.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";
import { contentTypeConfig } from "../../../helpers/contentConstant";

const AcademicDoc = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="academic-doc page">
      {isLoading && <Loader />}
      <SubHeader title="Customize Academic Documents" showBack={false} showRight={false} />
      <div className="home_section">
        <div className="home_section">
          {contentTypeConfig
            .filter((item) => item.typeId >= 50 && item.typeId <= 51)
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

export default AcademicDoc;
