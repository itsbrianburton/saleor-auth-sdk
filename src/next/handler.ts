import type { NextApiRequest, NextApiResponse } from "next";

import { serialize } from "cookie";
import { SaleorExternalAuth } from "../SaleorExternalAuth";

export const createSaleorExternalAuthHandler =
  (auth: SaleorExternalAuth) => async (req: NextApiRequest, res: NextApiResponse) => {
    const { state, code } = req.query as { state: string; code: string };

    const { token } = await auth.obtainAccessToken({ state, code });

    // MODIFIED: Set cookie expiration to 30 days from now
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    res.setHeader("Set-Cookie", serialize("token", token, {
      path: "/",
      expires, // Add 30-day expiration
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    }));
    res.redirect("/");
  };
