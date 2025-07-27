export async function uploadImage(file: File, apiKey: string, cloudName: string): Promise<string> {

  const formData = new FormData();
  formData.append('file', file);

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = { timestamp };

  const signatureResponse = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paramsToSign }),
  });

  const { signature } = await signatureResponse.json();

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image to Cloudinary.');
  }

  const uploadResult = await uploadResponse.json();
  return uploadResult.secure_url;
}