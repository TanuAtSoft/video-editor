import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import cloudinary from "cloudinary";

cloudinary.config({ 
  cloud_name: "dhkttruqs",
  api_key: "999882736374299",
  api_secret: "cV2nlcZcEyVbksNTlaO9U3fcAB4",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getImagesFromDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);

    // Filter out only image files (you can adjust the extensions as needed)
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".mp4",
        ".avi",
        ".mkv",
        ".mov",
        ".wmv",
      ].includes(ext);
    });

    return imageFiles;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/");
    options.filename = (name, ext, path, form) => {
      return path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
async function deleteImageFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}
const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/"));
  }
  const { fields, files } = await readFile(req, true);
  if (files) {
    const directoryPath = path.join(process.cwd(), "/");
    getImagesFromDirectory(directoryPath)
      .then((imageFiles) => {
        console.log("Image files:", imageFiles);
        if (
          imageFiles[0].includes(".jpg") ||
          imageFiles[0].includes(".jpeg") ||
          imageFiles[0].includes(".png") ||
          imageFiles[0].includes(".gif") ||
          imageFiles[0].includes(".bmp")
        ) {
          cloudinary.v2.uploader.upload(`${imageFiles[0]}`).then((result) => {
            console.log("result", result);
            res.json({ url: result?.url });
            const fileToDelete = path.join(directoryPath, imageFiles[0]); // Example: Delete the first image file
            deleteImageFile(fileToDelete);
          });
        }
        if (
          imageFiles[0].includes(".mp4") ||
          imageFiles[0].includes(".avi") ||
          imageFiles[0].includes(".mkv") ||
          imageFiles[0].includes(".mov") ||
          imageFiles[0].includes(".wmv")
        ) {
          cloudinary.v2.uploader.upload_large(
            `${imageFiles[0]}`,
            { resource_type: "video", chunk_size: 6000000 },
            function (error, result) {
              console.log(result, error);
               res.json({ url: result?.url });
            const fileToDelete = path.join(directoryPath, imageFiles[0]); // Example: Delete the first image file
            deleteImageFile(fileToDelete);
            }
          );
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  // res.json({ done: "ok" });
};

export default handler;
