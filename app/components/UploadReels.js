import axios from 'axios';
export default UploadReels = async (userID, video, title, description) => {
    try {
        console.log("\nuserID, video");
        console.log(userID, video);
        console.log("\nuserID, video\n");

        const formData = new FormData();
        formData.append('userID', userID);
        formData.append('file', {
            uri: video.uri,
            type: video.type || 'video/mp4', // fallback if missing
            name: video.name || 'upload.mp4', // fallback if missing
        });

        const response = await axios.post(
            'http://192.168.0.110:5000/api/v1/uploads/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).catch((error) => {
            console.log("error>><><>",error);
        });

        if (response?.status === 200) {
            console.log("response.data>",response.data);
            
            // Add to reels
            let data = JSON.stringify({
                "filePath": response.data.filePath,
                "userID": userID,
                "title": title ?? "Untitled",
                "description": description ?? "No Description "
            });
            console.log("data",data);
            

            const uploadingReel = await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: 'http://192.168.0.110:5000/api/v1/reels',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
                .then((response) => {
                    console.log("13>",response);

                    console.log(JSON.stringify(response.data));
                    return response.data
                })
                .catch((error) => {
                    console.log("12>",error);
                    return error
                });

            console.log("cc",uploadingReel);
        }

        console.log('Reel uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading reel:', error);
    }
}
