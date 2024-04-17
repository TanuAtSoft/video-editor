import axios from "axios";
import { useState, useRef } from "react";
import { Fragment } from "react";
import Script from "next/script";
import VideosModal from "@/components/VideosModal";
import PreviewModal from "@/components/PreviewModal";

const changeArrEl = (arr, publicId, newChange, caseType,id) => {
  var newArr = arr.map((item, i) => {
    if (caseType === "start_offset") {
      return item.publicId === publicId && i === id
        ? {
            ...item,
            start_offset: newChange,
          }
        : item;
    }
    if (caseType === "end_offset") {
      return item.publicId === publicId && i === id
        ? {
            ...item,
            end_offset: newChange,
          }
        : item;
    }
    if (caseType === "videoUrl") {
      return item.publicId === publicId && i === id
        ? {
            ...item,
            videoUrl: newChange,
          }
        : item;
    }
    if (caseType === "transition") {
      return item.publicId === publicId && i === id
        ? {
            ...item,
            transition: newChange,
          }
        : item;
    }
  });
  return newArr;
};

const filterArr = (arr, publicId) => {
  const ele = arr.filter((item) => item.publicId === publicId);
  return ele;
};

const EditVideo = ({ resData }) => {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState();
  const vidRef = useRef();
  const [openPreview, setOpenPreview] = useState(false);
  const options = [
    { value: "", text: "--Choose transition--" },
    { value: "fade", text: "fade" },
    { value: "wipeleft", text: "wipeleft" },
    { value: "wiperight", text: "wiperight" },
    { value: "wipeup", text: "wipeup" },
    { value: "wipedown", text: "wipedown" },
    { value: "slideleft", text: "slideleft" },
    { value: "slideright", text: "slideright" },
    { value: "slidedown", text: "slidedown" },
    { value: "slideup", text: "slideup" },
    { value: "circlecrop", text: "circlecrop" },
    { value: "rectcrop", text: "rectcrop" },
    { value: "distance", text: "distance" },
    { value: "fadeblack", text: "fadeblack" },
    { value: "fadewhite", text: "fadewhite" },
    { value: "radial", text: "radial" },
    { value: "smoothleft", text: "smoothleft" },
    { value: "smoothright", text: "smoothright" },
    { value: "smoothup", text: "smoothup" },
    { value: "smoothdown", text: "smoothdown" },
    { value: "circleopen", text: "circleopen" },
    { value: "circleclose", text: "circleclose" },
    { value: "vertopen", text: "vertopen" },
    { value: "vertclose", text: "vertclose" },
    { value: "horzopen", text: "horzopen" },

    { value: "horzclose", text: "horzclose" },
    { value: "dissolve", text: "dissolve" },
    { value: "pixelize", text: "pixelize" },
    { value: "diagtl", text: "diagtl" },
    { value: "diagtr", text: "diagtr" },
    { value: "diagbl", text: "diagbl" },
    { value: "diagbr", text: "diagbr" },
    { value: "hlslice", text: "hlslice" },
    { value: "hrslice", text: "hrslice" },
    { value: "vuslice", text: "vuslice" },
    { value: "vdslice", text: "vdslice" },
    { value: "hblur", text: "hblur" },
    { value: "fadegreys", text: "fadegreys" },
    { value: "wipetl", text: "wipetl" },
    { value: "wipetr", text: "wipetr" },
    { value: "wipebr", text: "wipebr" },
    { value: "squeezeh", text: "squeezeh" },
    { value: "squeezev", text: "squeezev" },
  ];

  const [duration, setDuration] = useState([
    {
      end_offset: 0,
      start_offset: 0,
    },
  ]);
  const [concatVid, setConcatVid] = useState([]);

  const handleTransition = (e, publicId,id) => {
    console.log("public __id",publicId)
    setConcatVid(changeArrEl(concatVid, publicId, e.target.value, "transition",id))
  };

  const handleTransform = async (publicId,id) => {
    let reqData;
    let elem = filterArr(concatVid, publicId);
    if (elem.length > 0) {
      reqData = {
        publicUrl: publicId,
        aspect_ratio: resData.aspect_ratio,
        duration: {
          start_offset: elem[0].start_offset,
          end_offset: elem[0].end_offset,
        },
      };
      const { data } = await axios.post("/api/transformVideo", {
        reqData,
      });
      if (data) {
        setConcatVid(changeArrEl(concatVid, publicId, data.url, "videoUrl",id));
      }
    } else {
      reqData = {
        publicUrl: publicId,
        aspect_ratio: resData.aspect_ratio,
        duration: {
          start_offset: duration.start_offset,
          end_offset: duration.end_offset,
        },
      };
      const { data } = await axios.post("/api/transformVideo", {
        reqData,
      });
      if (data) {
        setVideo(data.url);
      }
    }
  };

  const handleConcatVid = (videoUrl, publicId) => {
    setConcatVid([
      ...concatVid,
      {
        videoUrl: videoUrl,
        publicId: publicId,
        start_offset: 0,
        end_offset: 0,
        transition: "",
      },
    ]);
  };
  console.log("concatVid", concatVid);

  return (
    <Fragment>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/react-modal/3.14.3/react-modal.min.js"
        integrity="sha512-MY2jfK3DBnVzdS2V8MXo5lRtr0mNRroUI9hoLVv2/yL3vrJTam3VzASuKQ96fLEpyYIT4a8o7YgtUs5lPjiLVQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
      <div className="wrapper">
        {/* Main video element for the video editor */}
        <video
          className="video"
          height="300px"
          width="auto"
          autoload="metadata"
          preload="metadata"
          // muted={isMuted}
          controls={true}
          ref={vidRef}
          src={video ? video : resData.url}
          // onClick={() => {
          // 	playPause()
          // }}
          // onTimeUpdate={() => {
          // 	setSeekerBar(progressBarRef.current.style.width)
          // }}
        >
          {/* <source src={video? video : resData.url} type="video/mp4" /> */}
        </video>
        <div className="trim-div">
          <div className="start-time trim">
            <label>Start Time:</label>
            <input
              type="text"
              inputMode="numeric"
              onChange={(e) => {
                setDuration({
                  ...duration,
                  start_offset: e.target.value.toString(),
                });
              }}
            />
          </div>
          <div className="end-time trim">
            <label>End Time:</label>
            <input
              type="text"
              inputMode="numeric"
              onChange={(e) => {
                setDuration({
                  ...duration,
                  end_offset: e.target.value.toString(),
                });
              }}
            />
          </div>
          <div className="">
            <button
              onClick={() => {
                resData["transformation"] = duration;
                handleTransform(resData.publicUrl,-1);
                console.log("trim");
              }}
            >
              Trim
            </button>
          </div>
        </div>
        {concatVid.length > 0 &&
          concatVid.map((item, i) => {
            return (
              <Fragment key={i}>
                 <div
            className="custom-select"
          >
            <select  onChange={(e)=>handleTransition(e,item.publicId,i)}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
                <video
                  className="video"
                  height="300px"
                  width="auto"
                  autoload="metadata"
                  preload="metadata"
                  // muted={isMuted}
                  controls={true}
                  ref={vidRef}
                  src={item.videoUrl}
                >
                  {/* <source src={video? video : resData.url} type="video/mp4" /> */}
                </video>
                <div className="trim-div">
                  <div className="start-time trim">
                    <label>Start Time:</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      onChange={(e) => {
                        setConcatVid(
                          changeArrEl(
                            concatVid,
                            item.publicId,
                            e.target.value.toString(),
                            "start_offset",
                            i
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="end-time trim">
                    <label>End Time:</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      onChange={(e) => {
                        setConcatVid(
                          changeArrEl(
                            concatVid,
                            item.publicId,
                            e.target.value.toString(),
                            "end_offset",
                            i
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="">
                    <button
                      onClick={() => {
                        resData["transformation"] = duration;
                        handleTransform(item.publicId,i);
                      }}
                    >
                      Trim
                    </button>
                  </div>
                </div>
                {/* {i < concatVid.length - 1 && (
                  <div class="custom-select">
                    <select
                      onChange={(e) => {
                        console.log(e.target.value);
                        console.log("i", i);
                      }}
                    >
                      <option value="">Add transition</option>
                      <option value="">fade</option>
                      <option value="">wipeleft</option>
                      <option value="">wiperight</option>
                      <option value="">wipeup</option>
                      <option value="">wipedown</option>
                      <option value="">slideleft</option>

                      <option value="">slideright</option>
                      <option value="">slidedown</option>
                      <option value="">slideup</option>
                      <option value="">circlecrop</option>
                      <option value="">rectcrop</option>
                      <option value="">distance</option>

                      <option value="">fadeblack</option>
                      <option value="">fadewhite</option>
                      <option value="">radial</option>
                      <option value="">smoothleft</option>
                      <option value="">smoothright</option>
                      <option value="">smoothup</option>

                      <option value="">smoothdown</option>
                      <option value="">circleopen</option>
                      <option value="">circleclose</option>
                      <option value="">vertopen</option>
                      <option value="">vertclose</option>
                      <option value="">horzopen</option>

                      <option value="">horzclose</option>
                      <option value="">dissolve</option>
                      <option value="">pixelize</option>
                      <option value="">diagtl</option>
                      <option value="">diagtr</option>
                      <option value="">diagbl</option>

                      <option value="">diagbr</option>
                      <option value="">hlslice</option>
                      <option value="">hrslice</option>
                      <option value="">vuslice</option>
                      <option value="">vdslice</option>
                      <option value="">hblur</option>

                      <option value="">fadegreys</option>
                      <option value="">wipetl</option>
                      <option value="">wipetr</option>
                      <option value="">wipebr</option>
                      <option value="">squeezeh</option>
                      <option value="">squeezev</option>
                    </select>
                  </div>
                )} */}
              </Fragment>
            );
          })}

        <div className="concat">
          <button onClick={() => setOpen(true)}>concat new Video</button>
        </div>
      </div>
      {open && (
        <VideosModal
          open={open}
          setOpen={setOpen}
          handleConcatVid={handleConcatVid}
        />
      )}
      {openPreview && (
        <PreviewModal
          openPreview={openPreview}
          setOpenPreview={setOpenPreview}
          duration={duration}
          video = {video? video: resData.url}
          publicId ={resData.publicUrl}
          aspect_ratio ={resData.aspect_ratio}
          concatVid ={concatVid}
        />
      )}
      <Script
        src="https://media-editor.cloudinary.com/all.js"
        type="text/javascript"
      ></Script>
      <div className="preview-button-div">
        <button onClick={() => setOpenPreview(true)}>
          Click here to view your final video
        </button>
      </div>
    </Fragment>
  );
};

export default EditVideo;

export const getServerSideProps = async (ctx) => {
  const { videoUrl } = ctx.query;
  const { publicId } = ctx.query;
  const { aspect_ratio } = ctx.query;
  let resData = { url: "", publicUrl: "" };
  if (videoUrl) {
    resData["url"] = videoUrl;
    resData["publicUrl"] = publicId;
    resData["aspect_ratio"] = aspect_ratio;
  }
  return {
    props: {
      resData,
    },
  };
};
