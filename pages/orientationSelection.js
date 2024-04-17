import {  useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import Link from "next/link";
import axios from "axios";

const Orientation = ({ resData }) => {
  console.log("resData", resData);
  const [video, setVideo] = useState(resData.url);
  const [orient, setOrient] = useState("16:9");
 
  let cld = new Cloudinary({
    cloud: {
      cloudName: "dhkttruqs",
      apiKey: "999882736374299",
      apiSecret: "cV2nlcZcEyVbksNTlaO9U3fcAB4",
    },
  });
  const handleTransform = async () => {
    const reqData = resData;
    const { data } = await axios.post("/api/transformVideo", {
      reqData,
    });
     if(data){
      setVideo(data.url) 
     }
  };
  // useEffect(() => {
  //   handleTransform();
  // },[resData]);

  const handleChange =(type)=>{
   switch(type){
    case "landscape": setOrient("16:9");
    resData["aspect_ratio"] = "16:9"
    break;
    case "square": setOrient("1:1");
    resData["aspect_ratio"] = "1:1"
    break;
    case "portrait": setOrient("9:16");
    resData["aspect_ratio"] = "9:16"
    break;
   }
   handleTransform();
  }
  console.log("orient",orient)

  return (
    <div className="full-container">
      <h2>Select Orientation</h2>
      <div className="orientation_container">
        <div className="video-container">
          <video src={video} controls={true} height="100%" width="auto" />
        </div>
        <div className="orientation_selector">
          <p onClick={()=>handleChange("landscape")}>landscape</p>
          <p onClick={()=>handleChange("square")}>sqaure</p>
          <p onClick={()=>handleChange("portrait")}>portait</p>
        </div>
        <button><Link href={`/editVideo?videoUrl=${video}&publicId=${resData.publicUrl}&aspect_ratio=${orient}`} >Next</Link></button>
      </div>
    </div>
  );
};

export default Orientation;

export const getServerSideProps = async (ctx) => {
  const { videoUrl } = ctx.query;
  const { publicUrl } = ctx.query;
  let resData = { url: "", publicUrl: "" };
  if (videoUrl) {
    resData["url"] = videoUrl;
    resData["publicUrl"] = publicUrl;
  }
  return {
    props: {
      resData,
    },
  };
};
