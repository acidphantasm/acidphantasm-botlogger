import { inject, injectable } from "tsyringe";
import { DynamicRouterModService } from "@spt/services/mod/dynamicRouter/DynamicRouterModService";
import { ItemHelper } from "@spt/helpers/ItemHelper";

import { BotLogger } from "../Utils/BotLogger";
import { Logging } from "../Enums/Logging";

@injectable()
export class CustomDynamicRouterHooks
{
    constructor(
        @inject("DynamicRouterModService") protected dynamicRouterModService: DynamicRouterModService,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("BotLogger") protected botLogger: BotLogger
    )
    {}

    public registerQBRouterHooks(): void
    {
        this.dynamicRouterModService.registerDynamicRouter(
            "BotLogger-QBBotGenerationRouter",
            [
                {
                    url: "/QuestingBots/GenerateBot/",
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
        this.botLogger.log(Logging.DEBUG, "QB Compatibility Router registered");
    }
}