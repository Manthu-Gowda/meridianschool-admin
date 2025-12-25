import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdmissionsProcess.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";
import { contentTypeConfig } from "../../../helpers/contentConstant";

const AdmissionsProcess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="admissions-process page">
      {isLoading && <Loader />}
      <SubHeader title="Customize Admissions Process" showBack={false} showRight={false} />
      <div className="home_section">
        {contentTypeConfig
          .filter((item) => item.typeId >= 89 && item.typeId <= 90)
          .map((item) => (
            <BlockCard
              key={item.typeId}
              title={item.typeName}
              onClick={() => handleCardClick(item.typeId)}
            />
          ))}
      </div>
    </div>
  );
};

export default AdmissionsProcess;
