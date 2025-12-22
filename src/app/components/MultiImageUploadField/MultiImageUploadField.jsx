// src/components/MultiImageUploadField/MultiImageUploadField.jsx
import React, { useState, useRef, useCallback } from "react";
import "./MultiImageUploadField.scss";
import Cropper from "react-easy-crop";
import CustomModal from "../CustomModal/CustomModal"; // Ensure this path is correct

const MultiImageUploadField = ({
  title,
  value, // Array of image preview URLs or base64 strings
  onChange, // (fileOrNull, dataUrlOrEmpty) => void
  required = false,
  errorText = "",
  helperText = "",
  disabled = false,
  accept = "image/*",
  name = "image-upload",
  maxCount = 10,
  cropEnabled = false,
  aspectRatio = 16 / 9, // default ratio; you override per usage
}) => {
  const [internalError, setInternalError] = useState("");
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [rawImageUrl, setRawImageUrl] = useState(""); // Original data URL
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);

  // State to track multiple images
  const [imageList, setImageList] = useState(value || []);

  const handleFileChange = (e) => {
    if (disabled) return;
    const files = e.target.files;
    if (files.length === 0) return;

    // Ensure we don't exceed maxCount
    if (imageList.length >= maxCount) {
      setInternalError(`You can upload a maximum of ${maxCount} images.`);
      return;
    }

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setInternalError("Please upload an image file.");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setInternalError("");
      
      // Open crop modal if cropping is enabled
      if (cropEnabled) {
        setRawFile(file);
        setRawImageUrl(dataUrl);
        setIsCropOpen(true);
      } else {
        // Otherwise, update the image list with the data URL
        onChange([...imageList, dataUrl]);
        setImageList([...imageList, dataUrl]);
      }
    };
    reader.onerror = () => {
      setInternalError("Failed to read image file.");
      onChange(null, "");
    };

    reader.readAsDataURL(file);
  };

  const handleClear = (index, e) => {
    e.stopPropagation();
    if (disabled) return;
    setInternalError("");
    // Remove the image at the given index
    const updatedImages = imageList.filter((_, idx) => idx !== index);
    onChange(updatedImages);
    setImageList(updatedImages);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

      // Optionally create a new File from the cropped data (if you need to pass it)
      const croppedFile = await dataURLToFile(
        croppedDataUrl,
        rawFile?.name || "cropped-image.jpg"
      );

      // Update image list with cropped image
      const updatedImages = [...imageList, croppedDataUrl];
      onChange(updatedImages);
      setImageList(updatedImages);

      // Close crop modal and reset crop state
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
  };

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
    <div className={`image-upload-field ${internalError ? "has-error" : ""}`}>
      {title && <span className="input-label">{title}</span>}

      {/* File input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button onClick={() => inputRef.current.click()}>Upload Image</button>

      <div className="image-previews">
        {imageList.map((image, index) => (
          <div key={index} className="image-preview-card">
            <img src={image} alt={`preview-${index}`} />
            <button
              type="button"
              className="clear-image-btn"
              onClick={(e) => handleClear(index, e)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {internalError && <span className="input-error-text">{internalError}</span>}

      {/* Crop Modal */}
      {cropEnabled && isCropOpen && rawImageUrl && (
        <CustomModal
          open={isCropOpen}
          title="Crop Image"
          onClose={handleCancelCrop}
          showPrimary
          showDanger
          primaryText="Apply"
          dangerText="Cancel"
          onPrimary={handleApplyCrop}
          onDanger={handleCancelCrop}
        >
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
        </CustomModal>
      )}
    </div>
  );
};

export default MultiImageUploadField;
