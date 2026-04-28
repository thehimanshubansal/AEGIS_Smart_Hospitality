
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";

// We need the service account. Checking if it's in the env or a file.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "service-account.json";

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Service account file not found at:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const app = getApps().length === 0 
  ? initializeApp({ credential: cert(serviceAccount) }) 
  : getApp();

const auth = getAuth(app);

async function createTestUser(email: string, password: string, displayName: string) {
  try {
    const user = await auth.createUser({
      email,
      password,
      displayName,
    });
    console.log("Successfully created new user:", user.uid);
    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      console.log("User already exists:", user.uid);
      return user;
    }
    console.error("Error creating user:", error);
    throw error;
  }
}

const users = [
  { email: "test-guest@aegis.test", password: "Password123!", name: "Test Guest", role: "guest" },
  { email: "test-admin@aegis.test", password: "Password123!", name: "Test Admin", role: "admin" },
  { email: "test-staff@aegis.test", password: "Password123!", name: "Test Staff", role: "staff" },
];

(async () => {
  for (const u of users) {
    await createTestUser(u.email, u.password, u.name);
  }
})();
