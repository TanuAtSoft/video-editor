import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "60vh",
    scroll: "scrollY",
  },
};

// // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

const PreviewModal = ({
  openPreview,
  setOpenPreview,
  duration,
  video,
  publicId,
  aspect_ratio,
  concatVid,
}) => {
  const [finalVideo, setFinalVideo] = useState();

  function generateObjects(videoData) {
    const output = [];
    videoData.forEach((reqData) => {
      // output.push({ end_offset: `${reqData.end_offset.toString()}`, start_offset: `${reqData.start_offset.toString()}` });
      output.push({
        flags: reqData.transition !== "" ? `splice:transition_(name_${reqData.transition};du_4)` : "splice",
        overlay: `video:${reqData.publicId.split("/").join(":")}`,
      });
      if (
        reqData.end_offset > 0 &&
        reqData.start_offset > 0 &&
        reqData.end_offset > reqData.start_offset
      ) {
        output.push({
          end_offset: `${reqData.end_offset.toString()}`,
          start_offset: `${reqData.start_offset.toString()}`,
        });
      }
      output.push({
        aspect_ratio: `${aspect_ratio}`,
        crop: "fill",
        gravity: "north",
        width: 300,
      }),
        output.push({ flags: "layer_apply" });
    });
    output.unshift({
      aspect_ratio: `${aspect_ratio}`,
      crop: "fill",
      gravity: "north",
      width: 300,
    });
    if (
      duration.end_offset > 0 &&
      duration.start_offset > 0 &&
      duration.end_offset > duration.start_offset
    )
      output.unshift({
        end_offset: `${duration.end_offset.toString()}`,
        start_offset: `${duration.start_offset.toString()}`,
      });
    return output;
  }

  const fetchFinalVideo = async () => {
    let reqData = {};
    (reqData["publicId"] = publicId), (reqData["aspect_ratio"] = aspect_ratio);
    reqData["transformation"] = generateObjects(concatVid);
    const { data } = await axios.post("/api/generateFinalVideo", {
      reqData,
    });
    // const response = await fetch("/api/generateFinalVideo");
    console.log("data", data.url);
    if (data) {
      setFinalVideo(data.url);
    }
  };

  useEffect(() => {
    if (concatVid.length > 0) {
      fetchFinalVideo();
    } else {
      setFinalVideo(video);
    }
  }, []);

  function closeModal() {
    setOpenPreview(false);
  }
  // console.log("video",video)

  const handleDownload = (videoUrl) => {
    try {
      const videoRequest = new Request(videoUrl);
      fetch(videoRequest).then(() => {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.setAttribute("download", "waterfall.mp4");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Modal
        isOpen={openPreview}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="preview-modal-btns">
          <button onClick={closeModal}>close</button>
          {video && (
            <button onClick={() => handleDownload(video)}>Download</button>
          )}
        </div>
        <div>Final video</div>
        <div
          className="container"
          style={{ margin: "auto", textAlign: "center" }}
        >
          <br />
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
            <video
              className="video"
              height="300px"
              width="auto"
              src={finalVideo}
              controls={true}
              autoPlay="true"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PreviewModal;
