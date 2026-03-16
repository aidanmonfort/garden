import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins";
import { videoCardsViewRegistration } from "./quartz/components/VideoCardsView"

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()


ExternalPlugin.viewRegistry.register(videoCardsViewRegistration)

ExternalPlugin.BasesPage({
  defaultViewType: "table",
  customViews: {
    cards: videoCardsViewRegistration.render,
  },
});
