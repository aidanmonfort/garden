import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins";
import { videoCardsViewRegistration } from "./quartz/components/VideoCardsView"


ExternalPlugin.viewRegistry.register(videoCardsViewRegistration)

ExternalPlugin.BasesPage({
  customViews: {
    cards: videoCardsViewRegistration.render,
  },
});

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
