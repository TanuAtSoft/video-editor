import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import { Cloudinary } from "@cloudinary/url-gen";
import {
    responsive,
    lazyload,
    placeholder,
    AdvancedVideo,
  } from "@cloudinary/react";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height:'50vh',
    scroll: 'scrollY'
  },
};

// // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

const VideoModal =({open,setOpen,handleConcatVid}) =>{
  let subtitle;
  const [templates, setTemplates] = useState([]);
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
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
   // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={open}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <button onClick={closeModal}>close</button>
        <div>Your Galary</div>
        <div className="container" style={{margin:"auto",textAlign:"center"}}>
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
              <div
              key={i}
                className="videos"
                onClick={()=>{handleConcatVid(item.url,item.public_id);setOpen(false)}}
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
            );

          }
        })}
    </div>
    </div>
      </Modal>
    </div>
  );
}

export default VideoModal