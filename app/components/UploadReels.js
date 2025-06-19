import axios from "axios";
export default UploadReels = async (userID, video, title, description) => {
  try {
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("file", {
      uri: video.uri,
      type: video.type || "video/mp4", // fallback if missing
      name: video.name || "upload.mp4", // fallback if missing
    });

    const response = await axios
      .post("https://58f7-182-70-116-29.ngrok-free.app/api/v1/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.log("error>><><>", error);
      });

    if (response?.status === 200) {
      // Add to reels
      let data = JSON.stringify({
        filePath: response.data.filePath,
        userID: userID,
        title: title ?? "Untitled",
        description: description ?? "No Description ",
      });

      const uploadingReel = await axios
        .request({
          method: "POST",
          maxBodyLength: Infinity,
          url: "https://58f7-182-70-116-29.ngrok-free.app/api/v1/reels",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return error;
        });
    }

  } catch (error) {
    console.error(
      "Error uploading reel:",
      error.response ? error.response.data : error.message
    );
  }
};
