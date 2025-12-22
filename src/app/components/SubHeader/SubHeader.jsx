import React from "react";
import PropTypes from "prop-types";
import "./SubHeader.scss";
import BackArrowIcon from "../../assets/icons/pageIcons/BackArrowIcon";
import ButtonComponent from "../ButtonComponent/ButtonComponent"; // Assuming you're using your custom ButtonComponent
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SubHeader = ({
  title,
  showBack = true,
  onBack,
  showRight = true,
  onEditClick,
  onDeleteClick,
  divider = true,
  compact = false,
}) => {
  const rootClasses = [
    "subheader",
    divider ? "subheader--divider" : "",
    compact ? "subheader--compact" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div className={rootClasses}>
      {/* LEFT: Back + Title */}
      <div className="subheader__left">
        <div className="subheader__titleRow">
          {showBack && (
            <button
              type="button"
              className="subheader__back"
              aria-label="Go back"
              onClick={onBack}
            >
              <BackArrowIcon />
            </button>
          )}
          <h2>{title}</h2>
        </div>
      </div>

      {/* RIGHT: Edit and Delete buttons */}
      {showRight && (
        <div className="subheader__right">
          <ButtonComponent variant="secondary" onClick={onEditClick}>
            <EditOutlined />
            Edit
          </ButtonComponent>
          <ButtonComponent variant="danger" onClick={onDeleteClick}>
            <DeleteOutlined />
            Delete
          </ButtonComponent>
        </div>
      )}
    </div>
  );
};

SubHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  showRight: PropTypes.bool,
  onEditClick: PropTypes.func, // Optional edit button handler
  onDeleteClick: PropTypes.func, // Optional delete button handler
  divider: PropTypes.bool,
  compact: PropTypes.bool,
};

export default SubHeader;
