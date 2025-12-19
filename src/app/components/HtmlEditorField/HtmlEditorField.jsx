// src/components/HtmlEditorField/HtmlEditorField.jsx
import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import "./HtmlEditorField.scss";

const HtmlEditorField = ({
  title,
  value,
  onChange, // returns HTML string
  required = false,
  errorText = "",
  helperText = "",
}) => {
  const editor = useRef(null);
  const hasError = Boolean(errorText);

  const config = {
    readonly: false,
    height: 600,
    placeholder: "Write your message here...",
    uploader: { insertImageAsBase64URI: true },
    toolbarButtonSize: "large",
    removeButtons: [
      "hr", // removes "Break"
      "about", // removes Powered by Jodit popup info
      "eraser",
      "file",
      "fullsize",
    ],

    // REMOVE Powered by Jodit + footer elements
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    showPoweredBy: false,
  };

  return (
    <div className={`forminput ${hasError ? "has-error" : ""}`}>
      {title && (
        <span className="input-label">
          {title}
          {required && <span className="required-asterisk">*</span>}
        </span>
      )}

      <div className="html-editor-container">
        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          tabIndex={1}
          onBlur={(content) => onChange(content)}
        />
      </div>

      {hasError ? (
        <span className="input-error-text">{errorText}</span>
      ) : (
        helperText && <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
};

export default HtmlEditorField;
