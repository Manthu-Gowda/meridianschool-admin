import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./CommonForm.scss";

// Config
import { contentTypeConfig } from "../../helpers/contentConstant";

// Components
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ImageUploadField from "../../components/ImageUploadField/ImageUploadField";
import MultiImageUploadField from "../../components/MultiImageUploadField/MultiImageUploadField";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import DateField from "../../components/DateField/DateField";
import DocumentUploadField from "../../components/DocumentUploadField/DocumentUploadField";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomModal from "../../components/CustomModal/CustomModal";
import { PlusOutlined } from "@ant-design/icons";
import Loader from "../../components/Loader/Loader";
import { deleteApi, postApi } from "../../utils/apiService";
import { ADD_DETAILS, DELETE_DATA, GET_ALL_DETAILS, UPDATE_DETAILS } from "../../utils/apiPath";
import { errorToast, successToast } from "../../services/ToastHelper";
import BackArrowIcon from "../../assets/icons/pageIcons/BackArrowIcon";

const { RangePicker } = DatePicker;

const CommonForm = () => {
    const { typeId } = useParams();
      const navigate = useNavigate();
    const [currentConfig, setCurrentConfig] = useState(null);

    // Data State
    const [items, setItems] = useState([]); // List of content items
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null); // null means adding new
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State (for the modal)
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

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

    const formatValue = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return value;
    };

    const formatDateValue = (value) => {
        if (!value) return "—";
        const parsed = dayjs(value);
        return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "—";
    };

    const formatDateRangeValue = (range) => {
        if (!Array.isArray(range) || range.length < 2) return "—";
        const [start, end] = range;
        if (!start && !end) return "—";
        return `${formatDateValue(start)} to ${formatDateValue(end)}`;
    };

    // Initial Form Data Helper
    const getInitialFormData = (config) => ({
        typeId: config.typeId || "",
        typeName: config.typeName || "",
        blogId: null,
        blogImageIds: [],
        blogImageId: null,
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
        attachmentBase64: "",
        year: "",
        month: null,
        dateRange: [null, null],
        minAge: "",
    });

    const normalizeFormData = (data, config) => {
        const base = getInitialFormData(config);
        const merged = { ...base, ...data };
        if (!Array.isArray(merged.multipleImage)) merged.multipleImage = [];
        if (!Array.isArray(merged.descriptionList)) merged.descriptionList = [];
        if (!Array.isArray(merged.dateRange)) merged.dateRange = [null, null];
        if (config.isDescriptionListRequired && merged.descriptionList.length === 0) {
            merged.descriptionList = [{ header: "", title: "", content: "" }];
        }
        return merged;
    };

    const toNumber = (value) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    };

    const stripDataUrlPrefix = (value) => {
        if (!value) return "";
        if (typeof value !== "string") return "";
        if (!value.startsWith("data:")) return value;
        const commaIndex = value.indexOf(",");
        return commaIndex >= 0 ? value.slice(commaIndex + 1) : value;
    };

    const buildPayload = (data, config) => {
        const descriptionList = (data.descriptionList || []).map((item) => ({
            title: item.title || item.header || "",
            description: item.content || "",
        }));

        const multiImages = (data.multipleImage || [])
            .map((url) => stripDataUrlPrefix(url))
            .filter(Boolean);
        const singleImage = stripDataUrlPrefix(data.singleImage);
        const imageListSource = multiImages.length > 0 ? multiImages : (singleImage ? [singleImage] : []);
        const imageList = imageListSource.map((url, index) => ({
            imageId: data.blogImageIds?.[index] || data.blogImageId || null,
            url,
        }));

        const payload = {
            title: data.title || "",
            subTitle: data.subTitle || "",
            description: data.description || "",
            image: "",
            type: toNumber(config.typeId || data.typeId || 0),
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            urlName: data.urlName || "",
            imageList,
            descriptionList,
            date: data.date ? dayjs(data.date).toISOString() : null,
            urlLink: attachmentMode === "url" ? data.attachmentUrl || "" : "",
            uploadDocument: attachmentMode === "file" ? data.attachmentBase64 || "" : "",
            year: toNumber(data.year),
            month: data.month || "",
            fromDate: data.dateRange?.[0] ? dayjs(data.dateRange[0]).toISOString() : null,
            toDate: data.dateRange?.[1] ? dayjs(data.dateRange[1]).toISOString() : null,
            minAge: toNumber(data.minAge),
            descriptionListHeader: data.descriptionList?.[0]?.header || "",
        };

        if (data.blogId) {
            payload.blogId = data.blogId;
        }

        return payload;
    };

    const resolveInitialItems = (config) => {
        return [];
    };

    const buildAbsoluteUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        const base = import.meta.env.VITE_REACT_APP_API_URL || "";
        if (!base) return path;
        return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    };

    const mapApiItemToForm = (item, config) => {
        const imageUrls = (item.imageList || []).map((img) => buildAbsoluteUrl(img.url)).filter(Boolean);
        const fallbackImage = item.image ? buildAbsoluteUrl(item.image) : "";

        const mapped = {
            ...getInitialFormData(config),
            blogId: item.blogId || null,
            blogImageIds: (item.imageList || []).map((img) => img.imageId).filter(Boolean),
            blogImageId: item.imageList?.[0]?.imageId || null,
            title: item.title || "",
            subTitle: item.subTitle || "",
            description: item.description || "",
            singleImage: imageUrls.length <= 1 ? (imageUrls[0] || fallbackImage) : fallbackImage,
            multipleImage: imageUrls.length > 1 ? imageUrls : [],
            descriptionList: (item.descriptionList || []).map((desc) => ({
                header: item.descriptionListHeader || "",
                title: desc.title || "",
                content: desc.description || "",
            })),
            date: item.date ? dayjs(item.date) : null,
            attachmentName: item.uploadDocument || "",
            attachmentUrl: item.urlLink || "",
            year: item.year ?? "",
            month: item.month || "",
            dateRange: [
                item.fromDate ? dayjs(item.fromDate) : null,
                item.toDate ? dayjs(item.toDate) : null,
            ],
            minAge: item.minAge ?? "",
            metaTitle: item.metaTitle || "",
            metaDescription: item.metaDescription || "",
            urlName: item.urlName || "",
        };

        return normalizeFormData(mapped, config);
    };

    const fetchItems = async (config) => {
        if (!config?.typeId) return;
        setIsLoading(true);
        const payload = { pageIndex: 0, pageSize: 10, searchString: "" };
        const params = { params: { type: config.typeId } };
        const { statusCode, data, message, error } = await postApi(GET_ALL_DETAILS, payload, params);

        if (statusCode === 200) {
            const list = Array.isArray(data) ? data : data?.data || [];
            if (list.length === 0) {
                setItems(resolveInitialItems(config));
            } else if (!config.isSectionTypeListRequired) {
                setItems([mapApiItemToForm(list[0], config)]);
            } else {
                setItems(list.map((item) => mapApiItemToForm(item, config)));
            }
        } else {
            setItems(resolveInitialItems(config));
            errorToast(message || error || "Failed to load details");
        }
        setIsLoading(false);
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
            if (typeId) {
                fetchItems(config);
            } else {
                setItems(resolveInitialItems(config));
            }
        } else {
            console.error("Config not found");
        }
    }, [typeId]);

    const openModalWithData = (data, index = null) => {
        if (!currentConfig) return;
        const normalized = normalizeFormData(data, currentConfig);
        setEditingItemIndex(index);
        setFormData(normalized);
        setAttachmentMode(normalized.attachmentUrl ? "url" : "file");
        setErrors({});
        setIsModalOpen(true);
    };

    // Handlers for Form Input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (key) => (file, dataUrl) => {
        // if key is multipleImage, dataUrl is array
        setFormData((prev) => ({ ...prev, [key]: dataUrl }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const handleDateChange = (date, dateString) => {
        setFormData((prev) => ({ ...prev, date: date }));
        setErrors((prev) => ({ ...prev, date: "" }));
    };

    const handleDateRangeChange = (dates) => {
        setFormData((prev) => ({ ...prev, dateRange: dates }));
        setErrors((prev) => ({ ...prev, dateRange: "" }));
    };

    const handleDocumentChange = (file) => {
        if (!file) {
            setFormData((prev) => ({
                ...prev,
                attachment: null,
                attachmentName: "",
                attachmentBase64: "",
            }));
            setErrors((prev) => ({ ...prev, attachment: "" }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result;
            const base64 = stripDataUrlPrefix(dataUrl);
            setFormData((prev) => ({
                ...prev,
                attachment: file,
                attachmentName: file.name || "",
                attachmentBase64: base64,
            }));
            setErrors((prev) => ({ ...prev, attachment: "" }));
        };
        reader.onerror = () => {
            errorToast("Failed to read document");
            setFormData((prev) => ({
                ...prev,
                attachment: null,
                attachmentName: "",
                attachmentBase64: "",
            }));
            setErrors((prev) => ({ ...prev, attachment: "Failed to read document" }));
        };
        reader.readAsDataURL(file);
    };

    // Description List Actions
    const addDescriptionListItem = () => {
        setFormData(prev => ({
            ...prev,
            descriptionList: [...prev.descriptionList, { header: "", title: "", content: "" }]
        }));
        setErrors((prev) => ({ ...prev, descriptionList: "" }));
    };

    const removeDescriptionListItem = (index) => {
        setFormData(prev => ({
            ...prev,
            descriptionList: prev.descriptionList.filter((_, i) => i !== index)
        }));
        setErrors((prev) => {
            if (!prev.descriptionListItems) return prev;
            const updated = { ...prev.descriptionListItems };
            delete updated[index];
            return { ...prev, descriptionListItems: updated };
        });
    };

    const handleDescriptionListChange = (index, field, value) => {
        setFormData(prev => {
            const newList = [...prev.descriptionList];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, descriptionList: newList };
        });
        setErrors((prev) => {
            if (!prev.descriptionListItems || !prev.descriptionListItems[index]) return prev;
            const updated = { ...prev.descriptionListItems };
            updated[index] = { ...updated[index], [field]: "" };
            return { ...prev, descriptionListItems: updated };
        });
    };

    // Edit/Delete Handlers
    const handleEdit = (index) => {
        openModalWithData(items[index], index);
    };

    const getDeleteBlogImageId = (item) => {
        if (item?.blogImageId) return item.blogImageId;
        if (Array.isArray(item?.blogImageIds) && item.blogImageIds.length > 0) {
            return item.blogImageIds[0];
        }
        return null;
    };

    const handleDelete = async (index) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const targetItem = items[index];
            const blogImageId = getDeleteBlogImageId(targetItem);
            if (!blogImageId) {
                errorToast("Missing blog image id for delete");
                return;
            }
            setIsDeleting(true);
            const { statusCode, message, error } = await deleteApi(
                DELETE_DATA,
                { params: { blogImageId } }
            );

            if (statusCode === 200) {
                successToast(message || "Deleted successfully");
                if (typeId && currentConfig) {
                    await fetchItems(currentConfig);
                } else {
                    setItems(prev => prev.filter((_, i) => i !== index));
                }
            } else {
                errorToast(message || error || "Failed to delete");
            }
            setIsDeleting(false);
        }
    };

    const validateForm = () => {
        if (!currentConfig) return false;
        const nextErrors = {};
        const isEmpty = (value) =>
            value === null || value === undefined || value === "";

        if (currentConfig.isSingleImageRequired && !formData.singleImage) {
            nextErrors.singleImage = "This field is required";
        }
        if (currentConfig.isMultipleImageRequired && (!formData.multipleImage || formData.multipleImage.length === 0)) {
            nextErrors.multipleImage = "Please upload at least one image";
        }
        if (currentConfig.isTitleRequired && !formData.title?.trim()) {
            nextErrors.title = "This field is required";
        }
        if (currentConfig.isSubTitleRequired && !formData.subTitle?.trim()) {
            nextErrors.subTitle = "This field is required";
        }
        if (currentConfig.isDescriptionRequired && !formData.description?.trim()) {
            nextErrors.description = "This field is required";
        }
        if (currentConfig.isDateRequired && !formData.date) {
            nextErrors.date = "This field is required";
        }
        if (currentConfig.isYearRequired && isEmpty(formData.year)) {
            nextErrors.year = "This field is required";
        }
        if (currentConfig.isMonthRequired && !formData.month) {
            nextErrors.month = "This field is required";
        }
        if (currentConfig.isDateRangeRequired) {
            const [fromDate, toDate] = formData.dateRange || [];
            if (!fromDate || !toDate) {
                nextErrors.dateRange = "Please select a date range";
            }
        }
        if (currentConfig.isMinAgeRequired && isEmpty(formData.minAge)) {
            nextErrors.minAge = "This field is required";
        }
        if (currentConfig.isAttachmentRequired) {
            if (attachmentMode === "file" && !formData.attachmentBase64) {
                nextErrors.attachment = "Please upload a document";
            }
            if (attachmentMode === "url" && !formData.attachmentUrl?.trim()) {
                nextErrors.attachmentUrl = "Please enter a URL";
            }
        }
        if (currentConfig.isDescriptionListRequired) {
            if (!formData.descriptionList || formData.descriptionList.length === 0) {
                nextErrors.descriptionList = "Please add at least one item";
            } else {
                const itemErrors = {};
                formData.descriptionList.forEach((item, index) => {
                    const entry = {};
                    if (currentConfig.isDescriptionListHeaderRequired && !item.header?.trim()) {
                        entry.header = "This field is required";
                    }
                    if (currentConfig.isDescriptionListTitleRequired && !item.title?.trim()) {
                        entry.title = "This field is required";
                    }
                    if (currentConfig.isDescriptionListContentRequired && !item.content?.trim()) {
                        entry.content = "This field is required";
                    }
                    if (Object.keys(entry).length > 0) {
                        itemErrors[index] = entry;
                    }
                });
                if (Object.keys(itemErrors).length > 0) {
                    nextErrors.descriptionListItems = itemErrors;
                }
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentConfig) return;
        if (!validateForm()) return;
        setIsSaving(true);
        const payload = buildPayload(formData, currentConfig);
        const apiUrl = payload.blogId ? UPDATE_DETAILS : ADD_DETAILS;
        const { statusCode, message, error } = await postApi(apiUrl, payload);

        if (statusCode === 200) {
            setIsModalOpen(false);
            successToast(message || "Saved successfully");
            if (typeId) {
                await fetchItems(currentConfig);
            } else {
                setItems(prev => {
                    const newItems = [...prev];
                    if (!currentConfig.isSectionTypeListRequired) {
                        return [formData];
                    }
                    if (editingItemIndex !== null && editingItemIndex >= 0) {
                        newItems[editingItemIndex] = formData;
                    } else {
                        newItems.push(formData);
                    }
                    return newItems;
                });
            }
        } else {
            errorToast(message || error || "Failed to save");
        }
        setIsSaving(false);
    };

    // Render View (Read-Only)
    const renderItemView = (item) => {
        return (
            <div className="item-view-content">
                {/* Image */}
                {currentConfig.isSingleImageRequired && (
                    <div className="view-row">
                        {item.singleImage ? (
                            <img src={item.singleImage} alt="Preview" className="view-image-preview" />
                        ) : (
                            <div className="view-empty">No image uploaded</div>
                        )}
                    </div>
                )}
                {currentConfig.isMultipleImageRequired && (
                    item.multipleImage?.length > 0 ? (
                        <div className="view-row gallery-row">
                            {item.multipleImage.map((img, idx) => (
                                <img key={idx} src={img} alt="Preview" className="view-image-preview small" />
                            ))}
                        </div>
                    ) : (
                        <div className="view-row">
                            <div className="view-empty">No images uploaded</div>
                        </div>
                    )
                )}

                <div className="view-fields">
                    {currentConfig.isTitleRequired && (
                        <div className="view-field">
                            <span className="view-label">{currentConfig.titleName || "Title"}</span>
                            <span className="view-value">{formatValue(item.title)}</span>
                        </div>
                    )}
                    {currentConfig.isSubTitleRequired && (
                        <div className="view-field">
                            <span className="view-label">{currentConfig.subTitleName || "Sub Title"}</span>
                            <span className="view-value">{formatValue(item.subTitle)}</span>
                        </div>
                    )}
                    {currentConfig.isDescriptionRequired && (
                        <div className="view-field">
                            <span className="view-label">{currentConfig.descriptionName || "Description"}</span>
                            <p className="description-text">{formatValue(item.description)}</p>
                        </div>
                    )}
                    {currentConfig.isDescriptionListRequired && (
                        <div className="view-field">
                            <span className="view-label">List Items</span>
                            {item.descriptionList?.length > 0 ? (
                                <div className="view-list">
                                    {item.descriptionList.map((listItem, idx) => (
                                        <div key={idx} className="view-list-item">
                                            <div className="view-list-title">Item #{idx + 1}</div>
                                            {currentConfig.isDescriptionListHeaderRequired && (
                                                <div className="view-subfield">
                                                    <span className="view-sub-label">{currentConfig.descriptionListHeaderName || "Header"}:</span>
                                                    <span className="view-sub-value">{formatValue(listItem.header)}</span>
                                                </div>
                                            )}
                                            {currentConfig.isDescriptionListTitleRequired && (
                                                <div className="view-subfield">
                                                    <span className="view-sub-label">{currentConfig.descriptionListTitleName || "Title"}:</span>
                                                    <span className="view-sub-value">{formatValue(listItem.title)}</span>
                                                </div>
                                            )}
                                            {currentConfig.isDescriptionListContentRequired && (
                                                <div className="view-subfield">
                                                    <span className="view-sub-label">{currentConfig.descriptionListContentName || "Content"}:</span>
                                                    <span className="view-sub-value">{formatValue(listItem.content)}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="view-value">—</span>
                            )}
                        </div>
                    )}
                    {(currentConfig.isDateRequired || currentConfig.isDateRangeRequired || currentConfig.isYearRequired || currentConfig.isMonthRequired || currentConfig.isMinAgeRequired || currentConfig.isAttachmentRequired) && (
                        <div className="view-meta">
                            {currentConfig.isDateRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.dateName || "Date"}</span>
                                    <span className="view-value">{formatDateValue(item.date)}</span>
                                </div>
                            )}
                            {currentConfig.isDateRangeRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.dateRangeName || "Date Range"}</span>
                                    <span className="view-value">{formatDateRangeValue(item.dateRange)}</span>
                                </div>
                            )}
                            {currentConfig.isYearRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.yearName || "Year"}</span>
                                    <span className="view-value">{formatValue(item.year)}</span>
                                </div>
                            )}
                            {currentConfig.isMonthRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.monthName || "Month"}</span>
                                    <span className="view-value">{formatValue(item.month)}</span>
                                </div>
                            )}
                            {currentConfig.isMinAgeRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.minAgeName || "Min Age"}</span>
                                    <span className="view-value">{formatValue(item.minAge)}</span>
                                </div>
                            )}
                            {currentConfig.isAttachmentRequired && (
                                <div className="view-field">
                                    <span className="view-label">{currentConfig.attachementName || "Attachment"}</span>
                                    <span className="view-value">
                                        {formatValue(
                                            item.attachmentUrl ||
                                            item.attachmentName ||
                                            item.attachment?.name
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!currentConfig) return <div className="p-4">Loading...</div>;

    const onBack = () => {
            navigate(-1);
    };

    return (
        <div className="common-form-page">
            {isLoading && <Loader />}
            {isSaving && <Loader />}
            {isDeleting && <Loader />}
            <div className="form-header">
                 <button
              type="button"
              className="subheader__back"
              aria-label="Go back"
              onClick={onBack}
            >
              <BackArrowIcon />
            </button>
                <h1>{currentConfig.typeName}</h1>
            </div>

            <div className="items-list">
                {items.length === 0 && (
                    <div className="content-item-card">
                        <SubHeader
                            title={currentConfig.typeName}
                            showBack={false}
                            showRight={true}
                            onEditClick={() => openModalWithData(getInitialFormData(currentConfig))}
                            primaryActionLabel="Add"
                            primaryActionIcon={<PlusOutlined />}
                            showDelete={false}
                            compact={true}
                        />
                        <div className="item-view-content">
                            <p className="no-items">No items found.</p>
                        </div>
                    </div>
                )}
                {items.map((item, index) => (
                    <div key={index} className="content-item-card">
                        <SubHeader
                            title={`#${index + 1} ${currentConfig.typeName}`}
                            showBack={false}
                            showRight={true}
                            onEditClick={() => handleEdit(index)}
                            onDeleteClick={() => handleDelete(index)}
                            showDelete={currentConfig.isSectionTypeListRequired}
                            compact={true}
                        />
                        {renderItemView(item)}
                    </div>
                ))}

                {items.length > 0 && currentConfig.isSectionTypeListRequired && (
                    <div className="add-new-container">
                        <ButtonComponent onClick={() => {
                            openModalWithData(getInitialFormData(currentConfig));
                        }}>
                            + Add New {currentConfig.typeName}
                        </ButtonComponent>
                    </div>
                )}
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
                                    errorText={errors.singleImage}
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
                                    errorText={errors.multipleImage}
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
                                        errorText={errors.title}
                                    />
                                )}
                            {currentConfig.isSubTitleRequired && (
                                <InputField
                                    title={currentConfig.subTitleName || "Sub Title"}
                                    name="subTitle"
                                    value={formData.subTitle}
                                    onChange={handleChange}
                                    errorText={errors.subTitle}
                                />
                            )}
                            {currentConfig.isDescriptionRequired && (
                                <div className="form-row full-width">
                                    <TextAreaField
                                        title={currentConfig.descriptionName || "Description"}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        errorText={errors.description}
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
                            {errors.descriptionList && (
                                <span className="input-error-text">{errors.descriptionList}</span>
                            )}
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
                                                errorText={errors.descriptionListItems?.[index]?.header}
                                            />
                                        )}
                                        {currentConfig.isDescriptionListTitleRequired && (
                                            <InputField
                                                title={currentConfig.descriptionListTitleName || "Title"}
                                                value={item.title}
                                                onChange={(e) => handleDescriptionListChange(index, "title", e.target.value)}
                                                errorText={errors.descriptionListItems?.[index]?.title}
                                            />
                                        )}
                                        {currentConfig.isDescriptionListContentRequired && (
                                            <TextAreaField
                                                title={currentConfig.descriptionListContentName || "Content"}
                                                value={item.content}
                                                onChange={(e) => handleDescriptionListChange(index, "content", e.target.value)}
                                                errorText={errors.descriptionListItems?.[index]?.content}
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
                            {currentConfig.isDateRequired && <DateField title={currentConfig.dateName} value={formData.date} onChange={handleDateChange} errorText={errors.date} />}
                            {currentConfig.isYearRequired && <InputField title={currentConfig.yearName} name="year" type="number" value={formData.year} onChange={handleChange} errorText={errors.year} />}
                            {currentConfig.isMonthRequired && <InputField title={currentConfig.monthName} name="month" value={formData.month} onChange={handleChange} errorText={errors.month} />}
                            {currentConfig.isMinAgeRequired && <InputField title={currentConfig.minAgeName} name="minAge" type="number" value={formData.minAge} onChange={handleChange} errorText={errors.minAge} />}
                            {currentConfig.isDateRangeRequired && (
                                <div className="forminput">
                                    <span className="input-label">{currentConfig.dateRangeName}</span>
                                    <RangePicker value={formData.dateRange} onChange={handleDateRangeChange} />
                                    {errors.dateRange && <span className="input-error-text">{errors.dateRange}</span>}
                                </div>
                            )}
                            {currentConfig.isAttachmentRequired && (
                                <div className="attachment-block">
                                    <span className="input-label">{currentConfig.attachementName}</span>
                                    <div className="attachment-type-toggle">
                                        <label><input type="radio" checked={attachmentMode === "file"} onChange={() => { setAttachmentMode("file"); setErrors((prev) => ({ ...prev, attachmentUrl: "" })); }} /> File</label>
                                        <label><input type="radio" checked={attachmentMode === "url"} onChange={() => { setAttachmentMode("url"); setErrors((prev) => ({ ...prev, attachment: "" })); }} /> URL</label>
                                    </div>
                                    {attachmentMode === "file" ?
                                        <DocumentUploadField fileName={formData.attachmentName} onChange={handleDocumentChange} errorText={errors.attachment} /> :
                                        <InputField name="attachmentUrl" value={formData.attachmentUrl} onChange={handleChange} placeholder="URL" errorText={errors.attachmentUrl} />
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
