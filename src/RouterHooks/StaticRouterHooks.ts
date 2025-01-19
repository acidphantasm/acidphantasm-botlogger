import { inject, injectable } from "tsyringe";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { ItemHelper } from "@spt/helpers/ItemHelper";

import { BotLogger } from "../Utils/BotLogger";
import { Logging } from "../Enums/Logging";

@injectable()
export class CustomStaticRouterHooks
{
    constructor(
        @inject("StaticRouterModService") protected staticRouterService: StaticRouterModService,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("BotLogger") protected botLogger: BotLogger
    )
    {}

    public registerRouterHooks(): void
    {
        this.staticRouterService.registerStaticRouter(
            "BotLogger-BotGenerationRouter",
            [
                {
                    url: "/client/game/bot/generate",
                    action: async (url, info, sessionId, output) => 
                    {
                        try 
                        {
                            const outputJSON = JSON.parse(output);
                            if (outputJSON.data?.length)
                            {
                                this.botLogger.logBotGeneration(outputJSON);
                            }
                        }
                        catch (err) 
                        {
                            this.botLogger.log(Logging.WARN, "Bot Router hook failed.\n", `${err.stack}`);
                        }
                        return output;
                    }
                }
            ],
            "BotLogger"
        );
        this.botLogger.log(Logging.DEBUG, "Bot Generation Router registered");
    }    
}