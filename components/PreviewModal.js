import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height:'60vh',
    scroll: 'scrollY'
  },
};

// // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

const PreviewModal =({openPreview,setOpenPreview,duration, video,
  publicId,
  aspect_ratio,
  concatVid}) =>{
  const [finalVideo, setFinalVideo] = useState();

  function generateObjects(videoData) {
    const output = [];
    videoData.forEach((reqData) => {
        output.push({ end_offset: `${reqData.end_offset.toString()}`, start_offset: `${reqData.start_offset.toString()}` });
        output.push({flags: "splice", overlay: `video:${reqData.publicId.split('/').join(':')}` });
        output.push({ flags: "layer_apply" });
    });
   // output.unshift({ end_offset:duration.end_offset, start_offset: duration.start_offset})
    return output;
}

  const fetchFinalVideo = async () => {
    let reqData = {}
    reqData["publicId"] = publicId,
    reqData["aspect_ratio"] = aspect_ratio
     reqData["transformation"] = generateObjects(concatVid)
    const { data } = await axios.post("/api/generateFinalVideo", {
      reqData,
    });
    // const response = await fetch("/api/generateFinalVideo");
    console.log("data",data.url)
    // if (response.status === 200) {
    //   setFinalVideo(data.url);
    // }
  };

  useEffect(() => {
  if(concatVid.length > 0){
    fetchFinalVideo()
  }
  else {
    setFinalVideo(video)
  }
  }, []);


  function closeModal() {
    setOpenPreview(false);
  }
  // console.log("video",video)

  return (
    <div>
      <Modal
        isOpen={openPreview}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <button onClick={closeModal}>close</button>
        <div>Final video</div>
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
     <video   className="video" height="300px"
          width="auto" src={finalVideo} controls={true} autoPlay="true"/>
    </div>
    </div>
      </Modal>
    </div>
  );
}

export default PreviewModal