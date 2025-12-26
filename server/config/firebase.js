import admin from "firebase-admin";

import fs from "fs";

const serviceAccountKey = JSON.parse(
  fs.readFileSync(new URL("./serviceAccount.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});



export const verifyToken=async(req,res,next)=>{
    try{
        const token =req.headers.authorization.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        req.user=decoded;
        console.log("Decoded Token:", decoded);
        next();
    }catch(error){
        res.status(401).json(
            {
                error:"Unauthorized"
            }
        );
    }
};
export default admin;
