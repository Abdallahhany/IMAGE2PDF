import React, { useRef, useState } from "react";

interface FileUploadProps {
  handleImageChange: (files: File[]) => void;
  convertToPDF: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleImageChange,
  convertToPDF,
}) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.style.backgroundColor = "#f0f0f0";
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.style.backgroundColor = "white";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setUploading(true);
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.style.backgroundColor = "white";
    }

    const files = Array.from(e.dataTransfer.files);
    handleImageChange(files);
    previewImages(files);
    setUploading(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const files = Array.from(e.target.files);
      handleImageChange(files);
      previewImages(files);
      // Simulating upload time with setTimeout (you can replace this with actual upload logic)
      setUploading(false);
    }
  };

  const handleLabelClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const previewImages = (files: File[]) => {
    const filePreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          filePreviews.push(e.target.result);
          setImagePreviews([...filePreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="col-md-6">
      <div
        className={`drop-area border p-3 ${uploading ? "uploading" : ""} `}
        ref={dropAreaRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleLabelClick}
        role="button"
      >
        <p className="text-center mb-0">
          Drag and drop images here or click to select
        </p>
        <input
          type="file"
          className="form-control d-none"
          multiple
          onChange={handleFileInputChange}
          accept="image/*"
          ref={fileInputRef}
        />
      </div>
      {uploading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Uploading...</p>
        </div>
      ) : (
        <>
          <div className="row mt-5">
            {imagePreviews.map((preview, index) => (
              <div className="col-md-2" key={index}>
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="img-fluid mb-3"
                  width="50px"
                  height="50px"
                />
              </div>
            ))}
          </div>
        </>
      )}
      <button
        className="btn btn-primary"
        onClick={convertToPDF}
        disabled={uploading}
      >
        Convert to PDF
      </button>
    </div>
  );
};

export default FileUpload;
