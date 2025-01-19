import { DependencyContainer } from "tsyringe";

// SPT
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";

// Custom
import { Logging } from "./Enums/Logging";
import { InstanceManager } from "./InstanceManager";

class BotLogger implements IPreSptLoadMod
{
    private instance: InstanceManager = new InstanceManager();

    public preSptLoad(container: DependencyContainer): void 
    {
        const start = performance.now()
        this.instance.preSptLoad(container, "BotLogger");

        // Check and configure for Questing Bots if necessary
        const questingBots = this.instance.preSptModLoader.getImportedModsNames().includes("DanW-SPTQuestingBots");
        this.instance.botLogger.createLogFiles();
        if (questingBots)
        {
            this.instance.botLogger.log(Logging.WARN, "Questing Bots Detected. Updated bot logging.")
            this.instance.customDynamicRouterHooks.registerQBRouterHooks(); 
        }

        // Register necessary routers & SPT method changes
        this.instance.customStaticRouterHooks.registerRouterHooks();

        const timeTaken = performance.now() - start;
        this.instance.botLogger.log(Logging.DEBUG, `${timeTaken.toFixed(2)}ms for BotLogger.preSptLoad`);
    }
}

export const mod = new BotLogger();
