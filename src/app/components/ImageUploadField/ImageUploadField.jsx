// src/components/ImageUploadField/ImageUploadField.jsx
import React, { useRef, useState, useCallback } from "react";
import "./ImageUploadField.scss";
import Cropper from "react-easy-crop";
// ⚠️ Adjust this import to your actual reusable modal
// Example if it's in same folder level: "../CustomModal/CustomModal"
import CustomModal from "../CustomModal/CustomModal";

const ImageUploadField = ({
  title,
  value, // preview URL or base64 string (string)
  onChange, // (fileOrNull, dataUrlOrEmpty) => void
  required = false,
  errorText = "",
  helperText = "",
  disabled = false,
  accept = "image/*",
  name = "image-upload",

  // 🔥 New props for cropping
  cropEnabled = false,
  aspectRatio = 16 / 9, // default ratio; you override per usage
}) => {
  const [internalError, setInternalError] = useState("");
  const inputRef = useRef(null);

  const hasError = Boolean(errorText || internalError);

  // 🔥 State for cropping modal
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawFile, setRawFile] = useState(null); // original file
  const [rawImageUrl, setRawImageUrl] = useState(""); // original data URL

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const chooseFile = () => {
    if (disabled) return;
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setInternalError("Please upload an image file");
      return;
    }

    // 👉 Convert to base64 (data URL)
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result; // e.g. "data:image/png;base64,AAAA..."
      setInternalError("");

      if (cropEnabled) {
        // 🔥 Instead of immediately calling onChange, open crop modal
        setRawFile(file);
        setRawImageUrl(dataUrl);
        setIsCropOpen(true);
      } else {
        // Old behaviour
        onChange?.(file, dataUrl);
      }
    };
    reader.onerror = () => {
      setInternalError("Failed to read image file");
      onChange?.(null, "");
    };

    reader.readAsDataURL(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setInternalError("");
    // parent should set imageFile/imageUrl to null / ""
    onChange?.(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 👉 Helper to actually crop the image in a canvas and return base64
  const getCroppedImg = (imageSrc, pixelCrop, mimeType = "image/jpeg") => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        resolve(dataUrl);
      };

      image.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleApplyCrop = async () => {
    if (!rawImageUrl || !croppedAreaPixels) return;

    try {
      const mime =
        (rawFile?.type && rawFile.type.startsWith("image/") && rawFile.type) ||
        "image/jpeg";

      const croppedDataUrl = await getCroppedImg(
        rawImageUrl,
        croppedAreaPixels,
        mime
      );

      // 🔁 Optionally create a new File from the cropped data (if you ever need it)
      const croppedFile = await dataURLToFile(
        croppedDataUrl,
        rawFile?.name || "cropped-image.jpg"
      );

      // Notify parent with cropped image
      onChange?.(croppedFile, croppedDataUrl);

      // Reset crop state
      setIsCropOpen(false);
      setRawFile(null);
      setRawImageUrl("");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (err) {
      console.error("Crop failed", err);
      setInternalError("Failed to crop image");
    }
  };

  const handleCancelCrop = () => {
    setIsCropOpen(false);
    setRawFile(null);
    setRawImageUrl("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Convert base64 → File
  const dataURLToFile = (dataUrl, fileName) => {
    return new Promise((resolve) => {
      const arr = dataUrl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new File([u8arr], fileName, { type: mime }));
    });
  };

  return (
    <>
      <div className={`forminput image-field ${hasError ? "has-error" : ""}`}>
        {title && (
          <span className="input-label">
            {title}
            {required && <span className="required-asterisk"> *</span>}
          </span>
        )}

        {/* hidden input */}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="image-upload-wrapper">
          <div
            className={`filedropzone ${disabled ? "is-disabled" : ""} ${
              value ? "has-image" : ""
            }`}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            aria-label={value ? "Selected image" : "Click to upload image"}
            onClick={chooseFile}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                chooseFile();
              }
            }}
          >
            {value ? (
              <div className="image-preview-card">
                <img src={value} alt="Preview" />
                {/* If you want clear button back, uncomment & style
                <button
                  type="button"
                  className="image-clear-btn"
                  onClick={handleClear}
                >
                  ✕
                </button>
                */}
              </div>
            ) : (
              <div className="dz-inner">
                <svg
                  className="dz-icon"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M10 4l2 2h7a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4z"
                    opacity="0.35"
                  />
                  <path
                    fill="currentColor"
                    d="M4 8h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
                  />
                </svg>

                <p className="dz-text">Click to upload image</p>
                <p className="dz-subtext">PNG/JPG, up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {hasError ? (
          <span className="input-error-text">{internalError || errorText}</span>
        ) : (
          helperText && <span className="input-helper-text">{helperText}</span>
        )}
      </div>

      {/* 🔥 Crop Modal */}
      {cropEnabled && isCropOpen && rawImageUrl && (
        <CustomModal
          open={isCropOpen}
          title={title || "Crop Image"}
          onClose={handleCancelCrop} // 👈 close on X / mask
          // footer buttons
          showPrimary={true}
          showDanger={true}
          primaryText="Apply"
          dangerText="Cancel"
          onPrimary={handleApplyCrop} // 👈 Apply = crop
          onDanger={handleCancelCrop}
          width={600} // give a bit more space
          bodyClassName="crop-modal-body" // optional if you want custom layout
        >
          <div className="image-cropper-wrapper">
            <div className="crop-container">
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="crop-controls">
              <label>Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default ImageUploadField;
