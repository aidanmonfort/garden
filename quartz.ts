import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins";
import { videoCardsViewRegistration } from "./quartz/components/VideoCardsView"

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()

ExternalPlugin.BasesPage({
  defaultViewType: "cards",
});

ExternalPlugin.viewRegistry.register(videoCardsViewRegistration)
ExternalPlugin.viewRegistry.register({ ...videoCardsViewRegistration, id: "cards" })