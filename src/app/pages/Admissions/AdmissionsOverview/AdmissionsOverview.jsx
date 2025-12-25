import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdmissionsOverview.scss";
import SubHeader from "../../../components/SubHeader/SubHeader";
import BlockCard from "../../../components/BlockCards/BlockCards";
import Loader from "../../../components/Loader/Loader";
import { contentTypeConfig } from "../../../helpers/contentConstant";

const AdmissionsOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (typeId) => {
    navigate(`/common-form/${typeId}`);
  };

  return (
    <div className="admissions-overview page">
      {isLoading && <Loader />}
      <SubHeader title="Customize Admissions Overview" showBack={false} showRight={false} />
      <div className="home_section">
        {contentTypeConfig
          .filter((item) => item.typeId >= 85 && item.typeId <= 88)
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

export default AdmissionsOverview;
