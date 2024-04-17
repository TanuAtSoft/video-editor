export default async function handler(req, res) {
    const cloudName = 'dhkttruqs';
    const apiKey = '999882736374299';
    const apiSecret = 'cV2nlcZcEyVbksNTlaO9U3fcAB4';
  
    const authHeader = `Basic ${btoa(`${apiKey}:${apiSecret}`)}`;
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/video`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: authHeader,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    //   console.log('Fetched data:', data);
    //   return data; // You can return the data to handle it in your React component
    } catch(err){
   return res.status(err.status || 500).json({err});
}
};