import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { to, programs } = req.body;

    try {
      const { data, error } = await resend.emails.send({
        from: "Cornell Team And Leadership Center <onboarding@resend.dev>",
        to: [to],
        subject: "Programs Requiring Facilitators",
        react: EmailTemplate({ programs }),
      });

      if (error) {
        return res.status(400).json({ error });
      }

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
