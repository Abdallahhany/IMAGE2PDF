import React, { useState } from "react";
import axios from "axios";
import Header from "./header/header";
import FileUpload from "./file upload/file-upload";
import Footer from "./footer/footer";

const ImageToPDFUploader: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [pdfData, setPdfData] = useState<string | null>(null);


  const handleImageChange = (files: File[]) => {
    setSelectedImages(files);
  };          

  const convertToPDF = async () => {

    if (selectedImages.length === 0) {
      alert("Please select images to convert to PDF!");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await axios.post<{ pdf: string }>(
        "http://192.168.1.9:8080/image2pdf/convert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);

      setPdfData(response.data.pdf);
      
    } catch (error) {
      console.error("Error converting images to PDF:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container flex-grow-1 mt-5">
        <div className="row">
          <FileUpload
            handleImageChange={handleImageChange}
            convertToPDF={convertToPDF} />
          <div className="col-md-6">
            {pdfData && (
              <div className="mt-3">
                <h2>Converted PDF:</h2>
                <div className="text-center">
                  <iframe src={`data:application/pdf;base64,${pdfData}`} width="100%" height="600px" title="PDF"></iframe>
                </div>
                <div className="mt-3 text-center">
                  <a href={`data:application/pdf;base64,${pdfData}`} download="converted.pdf" className="btn btn-success">
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ImageToPDFUploader;
