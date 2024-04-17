import {  useEffect, useState } from "react";
import {
  responsive,
  lazyload,
  placeholder,
  AdvancedVideo,
} from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import Link from "next/link";

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [play, setPlay] = useState(false);
  const fetchVideosData = async () => {
    const response = await fetch("/api/getVideos");
    const data = await response.json();
    if (response.status === 200) {
      setTemplates(data.resources);
    }
  };

  useEffect(() => {
    fetchVideosData();
  }, []);

  let cld = new Cloudinary({
    cloud: {
      cloudName: "dhkttruqs",
      apiKey: "999882736374299",
      apiSecret: "cV2nlcZcEyVbksNTlaO9U3fcAB4",
    },
  });
  console.log("templates",templates)

  return (
    <div className="container" style={{margin:"auto",textAlign:"center"}}>
      <h2>Your Galary</h2>
   <div className="">
   <button style={{height:"40px",padding:"10px",border:"none",borderRadius:"5px",cursor:"pointer"}}><Link href={"/upload"}> Click to upload new media </Link></button>
   </div>
   <br/>
    <div
      className="video_container"
      style={{
        width: "94%",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        margin: "auto",
        padding: "auto",
      }}
    >
      {templates.length > 0 &&
        templates.map((item, i) => {
          {
            let cldVideo = cld.video(item.public_id);
            return (
              <Link key={i} href ={`/orientationSelection?videoUrl=${item.url}&publicUrl=${item.public_id}`}>
              <div
                className="videos"
                onMouseEnter={() => {
                  setPlay(true);
                  console.log("mouse in");
                }}
              >
                <AdvancedVideo
                  style={{ width: "300px", height: "auto" }}
                  cldVid={cldVideo}
                 // controls={true}
                  // autoPlay={play}
                   mute="true"
                  plugins={[lazyload(), responsive(100), placeholder()]}
                />
              </div>
              </Link>   
            );

          }
        })}
    </div>
    </div>
  );
};

export default Home;
