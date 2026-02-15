import axios from "axios";
import fs from "fs";
import { env } from "../interface/env.interface";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchEvent(id: number) {
  try {
    const res = await axios.get(
      `${env.WAHIS_API}/${id}/all-information?language=en`,
    );
    console.log("SUCCESS:", id);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 400) {
        console.log("SKIPPED (400):", id);
        return null;
      }
      console.log("ERROR:", id, err.response.status);
      return null;
    }
    console.log("NETWORK ERROR:", id);
    return null;
  }
}

(async () => {
  let allData = [];
  for (let id = 1; id <= 7260; id++) {
    const data = await fetchEvent(id);
    if (data) {
      allData.push(data);
    }
    await sleep(1200);
  }
  fs.writeFileSync("src/func/data.json", JSON.stringify(allData, null, 2));
  console.log("DONE");
})();
