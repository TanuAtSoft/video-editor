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
    const resp = await cloudinary.url(`${reqData.publicUrl}`, {
      resource_type: "video",
      transformation: [
        reqData.duration,
        // {end_offset: "10", start_offset: "6.5"},
        // { duration: "7.5" },
        // { height: 200, width: 300, crop: "fill" },
        // { flags: "splice", overlay: "video:samples:sea-turtle" },
        // { height: 200, width: 300, crop: "fill" },
        // { flags: "layer_apply" },
        { aspect_ratio: `${reqData?.aspect_ratio}`, crop: "fill" },
        //   { overlay: "video:samples:sea-turtle"},
        //   { duration: "7.5" },
        //   { width: 100, crop: "scale" },
        //   { effect: "fade:3000" },
        //   { effect: "fade:-3000" },
        //   { flags: "layer_apply", gravity: "south_east", start_offset: "2.5" },
      ],
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
