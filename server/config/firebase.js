import admin from "firebase-admin";

import fs from "fs";


const serviceAccountKey = JSON.parse(
  fs.readFileSync(new URL("./serviceAccount.json", import.meta.url))
);
if(!admin.apps.length){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
  });
}

export const firestore=admin.firestore();

// export const verifyToken=async(req,res,next)=>{
//     try{
//         const token =req.headers.authorization.split(" ")[1];
//         const decoded = await admin.auth().verifyIdToken(token);
//         req.user=decoded.uid;
//         console.log("Decoded Token:", decoded);
//         next();
//     }catch(error){
//         res.status(401).json(
//             {
//                 error:"Unauthorized"
//             }
//         );
//     }
// };

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded.uid;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default admin;
