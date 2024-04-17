import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dhkttruqs",
  api_key: "999882736374299",
  api_secret: "cV2nlcZcEyVbksNTlaO9U3fcAB4",
});

// aspect ratio for landcspae is 16:9
//aspect ratio for portait is 9:16
// aspect ratio for square is 1:1

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { reqData } = req.body;
    console.log("req", reqData);
    const resp = await cloudinary.url("mvgqsl1bzfgaz39hb0l1", {
      resource_type: "video",
      transformation: 
     [
      // {end_offset: "10", start_offset: "6.5"},
      // { aspect_ratio: "3:4", crop: "fill", gravity: "north", width: 250 },
        { overlay: "video:twxkmxwkzzkjdxeotz0c" },
        { flags: "layer_apply" },  
     ]
      ,
    });
    // const resp = cloudinary.url("docs/video_features_tutorial/hair", {
    //     resource_type: "video",
    //     transformation: [
    //       { aspect_ratio: "3:4", crop: "fill", gravity: "north", width: 250 },
    //       { duration: "5"},
    //       { duration: "5", flags: "splice",
    //           overlay: "video:docs:video_features_tutorial:makeup"},
    //       { aspect_ratio: "3:4", crop: "fill", gravity: "north", width: 250 },
    //       { flags: "layer_apply" },
    //   });
    // })();
    // const jsonRes = await resp.json()
    console.log("resp", resp);
    res.json({ url: resp });
  }
};

export default handler;
