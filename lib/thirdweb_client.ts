import { inAppWallet } from "thirdweb/wallets"
import { createThirdwebClient } from "thirdweb"
import { env_vars } from "./env_vars"

export const thirdweb_client = createThirdwebClient({
  clientId: env_vars.THIRD_WEB_CLIENT_ID,
  secretKey: env_vars.THIRD_WEB_SECRET_KEY,
})

export const wallets = [
  inAppWallet({
    auth: {
      options: ["wallet", "google", "discord", "github", "email", "telegram"],
    },

    // app metadata
    metadata: {
      name: "Bridged",
    },
  }),
]
