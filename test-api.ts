import axios from 'axios';

async function main() {
  try {
    const res = await axios.get('http://localhost:3000/api/proxy/admin/drivers');
    const firstId = res.data.data[0].id;
    console.log("FIRST ID:", firstId);
    
    const detailRes = await axios.get(`http://localhost:3000/api/proxy/admin/drivers/${firstId}`);
    console.log("DETAIL:", Object.keys(detailRes.data));
  } catch (e: any) {
    console.error("ERROR:", e.message);
  }
}
main();
