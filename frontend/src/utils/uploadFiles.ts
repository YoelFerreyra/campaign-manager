import { client } from "../api";

async function uploadFile(file: File) {
  const res = await client.post("/upload-url", {
    filename: file.name,
    content_type: file.type,
  });

  const { upload_url, file_url } = res.data;

  await client.put(upload_url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return file_url;
}

export default uploadFile;
