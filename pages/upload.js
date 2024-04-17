import { useState } from "react";
import axios from "axios";
import {FileDrop} from 'react-file-drop' 

const Upload= () => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [url,setUrl] = useState()

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/uploadVideos", formData);
      console.log(setUrl(data?.url));
    } catch (error) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  const handleChange= async(fileInput)=>{
      console.log(fileInput[0])
      let fileUrl = URL.createObjectURL(fileInput[0])
     // setIsUpload(false)
     setSelectedImage(fileUrl)
     setSelectedFile(fileInput[0])
  }
// console.log("selectedImage",selectedImage)
  return (
    <div className="max-w-4xl mx-auto p-20 space-y-6">
      <label>
        <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
          {selectedImage ? (
             <div className={'wrapper'}>
            {selectedFile.name.split(".").includes("png") &&<img style={{maxHeight:"300px",width:"auto"}} src={selectedImage} alt="" />}
            {selectedFile.name.split(".").includes("mp4") &&<video src={selectedImage} alt="" controls={true} autoPlay={true} />}
            </div>
          ) : (
            <div className={'wrapper'}>
            <input
            type="file"
               onChange={(e) => handleChange(e.target.files)}
              className='hidden'
              id='up_file'
            />
            <FileDrop
              onDrop={(e) => handleChange(e)}
              onTargetClick={() => document.getElementById('up_file').click()}
            >
              Click or drop your video here to edit!
            </FileDrop>
          </div>
          )}
        </div>
      </label>
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ opacity: uploading ? ".5" : "1" }}
        className="bg-red-600 p-3 w-32 text-center rounded text-white"
      >
        {uploading ? "Uploading.." : "Upload"}
      </button>
      <div className="mt-20 flex flex-col space-y-3">
       {url && <p>Video sucessfully upload with url {url}</p>}
      </div>
    </div>
  );
};

export default Upload;