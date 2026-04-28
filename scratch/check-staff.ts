
import { getDataConnectInstance } from "../src/lib/firebase";
import { listStaff } from "../src/dataconnect-generated";

async function checkStaff() {
  try {
    const dc = getDataConnectInstance();
    const res = await listStaff(dc);
    console.log("--- STAFF IN DATABASE ---");
    console.log(JSON.stringify(res.data.staffs, null, 2));
    console.log("--------------------------");
  } catch (error) {
    console.error("Error checking staff:", error);
  }
}

checkStaff();
