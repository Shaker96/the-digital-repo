import { NextResponse } from "next/server";
import { sendMail } from "../../service/mailService";
 
async function handler(req: Request) {
  try {
    if (req.method === 'POST') {
      const {email, firstname, lastname, docTitle} = await req.json();

      // console.log(req, email, firstname, lastname);
      
      // Process a POST request
      await sendMail(
        "The Digital Repo - New document waitng for approval.",
        "shakerchabarekh@gmail.com",
        `${firstname} ${lastname} has uploaded a new document from ${email}. Pending for approval.`
      );

      await sendMail(
        "The Digital Repo - Post uploaded successfully",
        email,
        `Hi ${firstname}! Your document titled ${docTitle} has been received and is pending for approval!`
      );

      return NextResponse.json({ message: 'success'});
    } else {
      // Handle any other HTTP method
      return NextResponse.json({ message: 'method not handled'});
    }
  } catch (err: any) {
    console.log(err);
  }
}

export { handler as GET, handler as POST };