import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./CommonForm.scss";

// Config
import { contentTypeConfig } from "../../helpers/contentConstant";

// Components
import InputField from "../../components/InputField/InputField";
import SelectInput from "../../components/SelectInput/SelectInput";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ImageUploadField from "../../components/ImageUploadField/ImageUploadField";
import MultiImageUploadField from "../../components/MultiImageUploadField/MultiImageUploadField";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import DateField from "../../components/DateField/DateField";
import DocumentUploadField from "../../components/DocumentUploadField/DocumentUploadField";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomModal from "../../components/CustomModal/CustomModal";

const { RangePicker } = DatePicker;

const CommonForm = () => {
    const { typeId } = useParams();
    const navigate = useNavigate();
    const [currentConfig, setCurrentConfig] = useState(null);

    // Data State
    const [items, setItems] = useState([]); // List of content items
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null); // null means adding new

    // Form State (for the modal)
    const [formData, setFormData] = useState({});

    // UI State
    const [attachmentMode, setAttachmentMode] = useState("file"); // "file" | "url"

    // Default Config for Preview Mode
    const defaultPreviewConfig = {
        typeId: 0,
        typeName: "Full Form Preview",
        isSectionTypeListRequired: true,
        isSingleImageRequired: true,
        singleImageUploadName: "Preview Single Image",
        isSingleImageCroperRequired: true,
        singleImageCropRatio: "1:1",
        singleImageMaxWidth: 800,
        isMultipleImageRequired: true,
        multipleImageUploadName: "Preview Multiple Images",
        isMultipleImageCroperRequired: true,
        isTitleRequired: true,
        titleName: "Preview Title",
        isSubTitleRequired: true,
        subTitleName: "Preview Sub Title",
        isDescriptionRequired: true,
        descriptionName: "Preview Description",
        isDescriptionListRequired: true,
        isDescriptionListHeaderRequired: true,
        descriptionListHeaderName: "List Header",
        isDescriptionListTitleRequired: true,
        descriptionListTitleName: "List Title",
        isDescriptionListContentRequired: true,
        descriptionListContentName: "List Content",
        isDateRequired: true,
        dateName: "Preview Date",
        isAttachmentRequired: true,
        attachementName: "Preview Attachment",
        isYearRequired: true,
        yearName: "Preview Year",
        isMonthRequired: true,
        monthName: "Preview Month",
        isDateRangeRequired: true,
        dateRangeName: "Preview Date Range",
        isMinAgeRequired: true,
        minAgeName: "Preview Min Age",
    };

    // Initial Form Data Helper
    const getInitialFormData = (config) => ({
        typeId: config.typeId || "",
        typeName: config.typeName || "",
        sectionType: null,
        singleImage: "",
        multipleImage: [],
        title: "",
        subTitle: "",
        description: "",
        descriptionList: [],
        date: null,
        attachment: null,
        attachmentUrl: "",
        attachmentName: "",
        year: "",
        month: null,
        dateRange: [null, null],
        minAge: "",
    });

    // Mock Data Generator
    const generateMockItems = (config) => {
        // Generate 2 mock items for demonstration
        return [1, 2].map(i => ({
            ...getInitialFormData(config),
            title: `${config.typeName} Item ${i}`,
            description: `This is a sample description for item ${i}.`,
            singleImage: "https://via.placeholder.com/150",
        }));
    };

    // Load Config
    useEffect(() => {
        let config = null;
        if (typeId) {
            config = contentTypeConfig.find(c => c.typeId === Number(typeId));
        } else {
            config = defaultPreviewConfig;
        }

        if (config) {
            setCurrentConfig(config);
            // Load mock items if it's a list type, or just one item if single
            // For now assuming all are lists as per user request
            setItems(generateMockItems(config));
        } else {
            console.error("Config not found");
        }
    }, [typeId]);

    // Handlers for Form Input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (key) => (file, dataUrl) => {
        // if key is multipleImage, dataUrl is array
        setFormData((prev) => ({ ...prev, [key]: dataUrl }));
    };

    const handleDateChange = (date, dateString) => {
        setFormData((prev) => ({ ...prev, date: date }));
    };

    const handleDateRangeChange = (dates) => {
        setFormData((prev) => ({ ...prev, dateRange: dates }));
    };

    const handleDocumentChange = (file) => {
        setFormData((prev) => ({
            ...prev,
            attachment: file,
            attachmentName: file ? file.name : ""
        }));
    };

    // Description List Actions
    const addDescriptionListItem = () => {
        setFormData(prev => ({
            ...prev,
            descriptionList: [...prev.descriptionList, { header: "", title: "", content: "" }]
        }));
    };

    const removeDescriptionListItem = (index) => {
        setFormData(prev => ({
            ...prev,
            descriptionList: prev.descriptionList.filter((_, i) => i !== index)
        }));
    };

    const handleDescriptionListChange = (index, field, value) => {
        setFormData(prev => {
            const newList = [...prev.descriptionList];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, descriptionList: newList };
        });
    };

    // Edit/Delete Handlers
    const handleEdit = (index) => {
        setEditingItemIndex(index);
        setFormData({ ...items[index] }); // Load item data into form
        setIsModalOpen(true);
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Save logic: update items array
        setItems(prev => {
            const newItems = [...prev];
            if (editingItemIndex !== null && editingItemIndex >= 0) {
                newItems[editingItemIndex] = formData;
            } else {
                newItems.push(formData);
            }
            return newItems;
        });
        setIsModalOpen(false);
    };

    // Render View (Read-Only)
    const renderItemView = (item) => {
        return (
            <div className="item-view-content">
                {/* Image */}
                {(currentConfig.isSingleImageRequired && item.singleImage) && (
                    <div className="view-row">
                        <img src={item.singleImage} alt="Preview" className="view-image-preview" />
                    </div>
                )}
                {(currentConfig.isMultipleImageRequired && item.multipleImage?.length > 0) && (
                    <div className="view-row gallery-row">
                        {item.multipleImage.map((img, idx) => (
                            <img key={idx} src={img} alt="Preview" className="view-image-preview small" />
                        ))}
                    </div>
                )}

                {/* Text */}
                {currentConfig.isTitleRequired && item.title && <h3>{item.title}</h3>}
                {currentConfig.isSubTitleRequired && item.subTitle && <h4>{item.subTitle}</h4>}
                {currentConfig.isDescriptionRequired && item.description && <p className="description-text">{item.description}</p>}

                {/* Meta */}
                <div className="meta-tags">
                    {item.date && <span>Date: {dayjs(item.date).format("YYYY-MM-DD")}</span>}
                    {item.year && <span>Year: {item.year}</span>}
                    {item.minAge && <span>Min Age: {item.minAge}</span>}
                </div>
            </div>
        );
    };

    if (!currentConfig) return <div className="p-4">Loading...</div>;

    return (
        <div className="common-form-page">
            <div className="form-header">
                <h1>{currentConfig.typeName}</h1>
            </div>

            <div className="items-list">
                {items.map((item, index) => (
                    <div key={index} className="content-item-card">
                        <SubHeader
                            title={`#${index + 1} ${currentConfig.typeName}`}
                            showBack={false}
                            showRight={true}
                            onEditClick={() => handleEdit(index)}
                            onDeleteClick={() => handleDelete(index)}
                            compact={true}
                        />
                        {renderItemView(item)}
                    </div>
                ))}
                {items.length === 0 && <p className="no-items">No items found.</p>}

                <div className="add-new-container">
                    <ButtonComponent onClick={() => {
                        setEditingItemIndex(null);
                        setFormData(getInitialFormData(currentConfig));
                        setIsModalOpen(true);
                    }}>
                        + Add New {currentConfig.typeName}
                    </ButtonComponent>
                </div>
            </div>

            {/* Edit/Add Modal */}
            <CustomModal
                open={isModalOpen}
                title={`${editingItemIndex !== null ? "Edit" : "Add"} ${currentConfig.typeName}`}
                onClose={() => setIsModalOpen(false)}
                showPrimary={true}
                primaryText="Submit"
                onPrimary={handleSave}
                showDanger={true}
                dangerText="Cancel"
                width={800}
            >
                <form className="common-form-modal-content">
                    {/* Images */}
                    {(currentConfig.isSingleImageRequired || currentConfig.isMultipleImageRequired) && (
                        <div className="form-section">
                            {currentConfig.isSingleImageRequired && (
                                <ImageUploadField
                                    title={currentConfig.singleImageUploadName || "Single Image"}
                                    name="singleImage"
                                    value={formData.singleImage}
                                    onChange={handleImageChange("singleImage")}
                                    cropEnabled={currentConfig.isSingleImageCroperRequired}
                                    aspectRatio={(() => {
                                        if (!currentConfig.singleImageCropRatio) return 1;
                                        const [w, h] = currentConfig.singleImageCropRatio.split(":").map(Number);
                                        return w / h || 1;
                                    })()}
                                    helperText={`Max Width: ${currentConfig.singleImageMaxWidth}px`}
                                />
                            )}
                            {currentConfig.isMultipleImageRequired && (
                                <MultiImageUploadField
                                    title={currentConfig.multipleImageUploadName || "Multiple Image"}
                                    name="multipleImage"
                                    value={formData.multipleImage}
                                    onChange={handleImageChange("multipleImage")}
                                    cropEnabled={currentConfig.isMultipleImageCroperRequired}
                                />
                            )}
                        </div>
                    )}

                    {/* Text Content */}
                    {(currentConfig.isTitleRequired || currentConfig.isSubTitleRequired || currentConfig.isDescriptionRequired) && (
                        <div className="form-section">
                            {currentConfig.isTitleRequired && (
                                <InputField
                                    title={currentConfig.titleName || "Title"}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            )}
                            {currentConfig.isSubTitleRequired && (
                                <InputField
                                    title={currentConfig.subTitleName || "Sub Title"}
                                    name="subTitle"
                                    value={formData.subTitle}
                                    onChange={handleChange}
                                />
                            )}
                            {currentConfig.isDescriptionRequired && (
                                <div className="form-row full-width">
                                    <TextAreaField
                                        title={currentConfig.descriptionName || "Description"}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description List */}
                    {currentConfig.isDescriptionListRequired && (
                        <div className="form-section">
                            <div className="section-header-row">
                                <h3>List Items</h3>
                                <ButtonComponent onClick={addDescriptionListItem} size="small" variant="secondary" type="button">
                                    + Add Item
                                </ButtonComponent>
                            </div>
                            {formData.descriptionList?.map((item, index) => (
                                <div key={index} className="description-list-item">
                                    <div className="item-header">
                                        <span>Item #{index + 1}</span>
                                        <button type="button" className="remove-btn" onClick={() => removeDescriptionListItem(index)}>Remove</button>
                                    </div>
                                    <div className="form-grid-modal">
                                        {currentConfig.isDescriptionListHeaderRequired && (
                                            <InputField
                                                title={currentConfig.descriptionListHeaderName || "Header"}
                                                value={item.header}
                                                onChange={(e) => handleDescriptionListChange(index, "header", e.target.value)}
                                            />
                                        )}
                                        {currentConfig.isDescriptionListTitleRequired && (
                                            <InputField
                                                title={currentConfig.descriptionListTitleName || "Title"}
                                                value={item.title}
                                                onChange={(e) => handleDescriptionListChange(index, "title", e.target.value)}
                                            />
                                        )}
                                        {currentConfig.isDescriptionListContentRequired && (
                                            <TextAreaField
                                                title={currentConfig.descriptionListContentName || "Content"}
                                                value={item.content}
                                                onChange={(e) => handleDescriptionListChange(index, "content", e.target.value)}
                                                rows={2}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dates & Meta */}
                    {(currentConfig.isDateRequired || currentConfig.isDateRangeRequired || currentConfig.isYearRequired || currentConfig.isMonthRequired || currentConfig.isMinAgeRequired || currentConfig.isAttachmentRequired) && (
                        <div className="form-section">
                            {currentConfig.isDateRequired && <DateField title={currentConfig.dateName} value={formData.date} onChange={handleDateChange} />}
                            {currentConfig.isYearRequired && <InputField title={currentConfig.yearName} name="year" type="number" value={formData.year} onChange={handleChange} />}
                            {currentConfig.isMinAgeRequired && <InputField title={currentConfig.minAgeName} name="minAge" type="number" value={formData.minAge} onChange={handleChange} />}
                            {currentConfig.isDateRangeRequired && (
                                <div className="forminput">
                                    <span className="input-label">{currentConfig.dateRangeName}</span>
                                    <RangePicker value={formData.dateRange} onChange={handleDateRangeChange} />
                                </div>
                            )}
                            {currentConfig.isAttachmentRequired && (
                                <div className="attachment-block">
                                    <span className="input-label">{currentConfig.attachementName}</span>
                                    <div className="attachment-type-toggle">
                                        <label><input type="radio" checked={attachmentMode === "file"} onChange={() => setAttachmentMode("file")} /> File</label>
                                        <label><input type="radio" checked={attachmentMode === "url"} onChange={() => setAttachmentMode("url")} /> URL</label>
                                    </div>
                                    {attachmentMode === "file" ?
                                        <DocumentUploadField fileName={formData.attachmentName} onChange={handleDocumentChange} /> :
                                        <InputField name="attachmentUrl" value={formData.attachmentUrl} onChange={handleChange} placeholder="URL" />
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </CustomModal>
        </div>
    );
};

export default CommonForm;
