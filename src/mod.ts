import { DependencyContainer } from "tsyringe";

// SPT
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";

// Custom
import { Logging } from "./Enums/Logging";
import { InstanceManager } from "./InstanceManager";

class BotLogger implements IPreSptLoadMod, IPostDBLoadMod, IPostSptLoadMod
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

    public postDBLoad(container: DependencyContainer): void
    {
        const start = performance.now()
        this.instance.postDBLoad(container);
        
        const timeTaken = performance.now() - start;
        this.instance.botLogger.log(Logging.DEBUG, `${timeTaken.toFixed(2)}ms for BotLogger.postDBLoad`);
    }

    public postSptLoad(container: DependencyContainer): void 
    {
        const start = performance.now()
        this.instance.postSptLoad(container);

        if (this.instance.modInformation.versionNumber.includes("alpha"))
        {
            this.instance.botLogger.log(Logging.WARN, "!!! THIS IS AN EARLY RELEASE BUILD !!!")
            this.instance.botLogger.log(Logging.WARN, "Do not report problems with this anywhere except #acidphantasm-mods in the SPT Discord.")
            this.instance.botLogger.log(Logging.WARN, "Thank you for testing!")
        }

        const timeTaken = performance.now() - start;
        this.instance.botLogger.log(Logging.DEBUG, `${timeTaken.toFixed(2)}ms for BotLogger.postSptLoad`);
    }
}

export const mod = new BotLogger();
