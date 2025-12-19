// src/components/DocumentUploadField/DocumentUploadField.jsx
import React, { useRef } from "react";
import "./DocumentUploadField.scss";

const DocumentUploadField = ({
  title,
  required = false,
  fileName = "",
  helperText = "",
  errorText = "",
  disabled = false,
  onChange, // (fileOrNull) => void
}) => {
  const inputRef = useRef(null);
  const hasError = Boolean(errorText);

  const handleClick = () => {
    if (disabled) return;
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange?.(null);
      return;
    }
    onChange?.(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className={`doc-field ${hasError ? "has-error" : ""}`}>
      <div className="doc-field__label-row">
        <label className="doc-field__label">
          {title}
          {required && <span className="doc-field__required">*</span>}
        </label>
      </div>

      <div
        className={`doc-field__card ${disabled ? "is-disabled" : ""}`}
        onClick={handleClick}
      >
        <div className="doc-field__icon">
          {/* You can swap this for an SVG icon if you have one */}
          <span>📄</span>
        </div>
        <div className="doc-field__content">
          {fileName ? (
            <>
              <div className="doc-field__file-name" title={fileName}>
                {fileName}
              </div>
              <div className="doc-field__sub-text">Click to replace PDF</div>
            </>
          ) : (
            <>
              <div className="doc-field__placeholder">
                Click to upload PDF document
              </div>
              <div className="doc-field__sub-text">
                {helperText || "PDF files only"}
              </div>
            </>
          )}
        </div>
        {fileName && (
          <button
            type="button"
            className="doc-field__clear"
            onClick={handleClear}
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="doc-field__input"
          onChange={handleFileChange}
        />
      </div>

      {helperText && !hasError && (
        <p className="doc-field__helper-text">{helperText}</p>
      )}
      {hasError && <p className="doc-field__error-text">{errorText}</p>}
    </div>
  );
};

export default DocumentUploadField;
