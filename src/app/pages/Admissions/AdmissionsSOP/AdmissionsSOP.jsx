import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdmissionsSOP.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";
import { contentTypeConfig } from "../../../helpers/contentConstant";

const AdmissionsSOP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="admissions-sop page">
      {isLoading && <Loader />}
      <SubHeader title="Customize Admissions SOP" showBack={false} showRight={false} />
      <div className="home_section">
        {contentTypeConfig
          .filter((item) => item.typeId >= 92 && item.typeId <= 94)
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

export default AdmissionsSOP;
