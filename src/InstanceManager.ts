import * as fs from "fs";
import * as path from "path";

// SPT
import { DependencyContainer, Lifecycle } from "tsyringe";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { DynamicRouterModService } from "@spt/services/mod/dynamicRouter/DynamicRouterModService";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { DatabaseService } from "@spt/services/DatabaseService";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { WeatherGenerator } from "@spt/generators/WeatherGenerator";
import { BotLevelGenerator } from "@spt/generators/BotLevelGenerator";
import { RandomUtil } from "@spt/utils/RandomUtil";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { BotGenerator } from "@spt/generators/BotGenerator";
import { BotWeaponGenerator } from "@spt/generators/BotWeaponGenerator";
import { WeightedRandomHelper } from "@spt/helpers/WeightedRandomHelper";
import { LocalisationService } from "@spt/services/LocalisationService";
import { HashUtil } from "@spt/utils/HashUtil";
import { InventoryMagGen } from "@spt/generators/weapongen/InventoryMagGen";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { BotEquipmentModGenerator } from "@spt/generators/BotEquipmentModGenerator";
import { BotGeneratorHelper } from "@spt/helpers/BotGeneratorHelper";
import { BotWeaponGeneratorHelper } from "@spt/helpers/BotWeaponGeneratorHelper";
import { BotWeaponModLimitService } from "@spt/services/BotWeaponModLimitService";
import { RepairService } from "@spt/services/RepairService";
import { SeasonalEventService } from "@spt/services/SeasonalEventService";
import { VFS } from "@spt/utils/VFS";

// Custom
import { BotLogger } from "./Utils/BotLogger";
import { CustomStaticRouterHooks } from "./RouterHooks/StaticRouterHooks";
import { ModInformation } from "./Globals/ModInformation";
import { CustomDynamicRouterHooks } from "./RouterHooks/DynamicRouterHooks";

export class InstanceManager 
{
    //#region accessible in or after preAkiLoad
    public modName: string;
    public debug: boolean;
    public container: DependencyContainer;
    public preSptModLoader: PreSptModLoader;
    public itemHelper: ItemHelper;
    public logger: ILogger;
    public staticRouter: StaticRouterModService;
    public dynamicRouter: DynamicRouterModService;
    public modInformation: ModInformation;
    public vfs: VFS;

    public botLogger: BotLogger;
    public customStaticRouterHooks: CustomStaticRouterHooks;
    public customDynamicRouterHooks: CustomDynamicRouterHooks;
    //#endregion

    //#region accessible in or after postDBLoad
    public tables: IDatabaseTables;
    //#endregion

    // Call at the start of the mods postDBLoad method
    public preSptLoad(container: DependencyContainer, mod: string): void
    {
        this.modName = mod;

        // SPT Classes
        this.container = container;
        this.preSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.staticRouter = container.resolve<StaticRouterModService>("StaticRouterModService");
        this.dynamicRouter = container.resolve<DynamicRouterModService>("DynamicRouterModService");
        this.itemHelper = container.resolve<ItemHelper>("ItemHelper");
        this.vfs = container.resolve<VFS>("VFS");

        // Custom Classes
        this.container.register<ModInformation>("ModInformation", ModInformation, { lifecycle: Lifecycle.Singleton })
        this.modInformation = container.resolve<ModInformation>("ModInformation");
        this.container.register<BotLogger>("BotLogger", BotLogger, { lifecycle: Lifecycle.Singleton });
        this.botLogger = container.resolve<BotLogger>("BotLogger");

        // Custom Special
        this.container.register<CustomDynamicRouterHooks>("CustomDynamicRouterHooks", CustomDynamicRouterHooks, { lifecycle: Lifecycle.Singleton });
        this.customDynamicRouterHooks = container.resolve<CustomDynamicRouterHooks>("CustomDynamicRouterHooks");
        this.container.register<CustomStaticRouterHooks>("CustomStaticRouterHooks", CustomStaticRouterHooks, { lifecycle: Lifecycle.Singleton });
        this.customStaticRouterHooks = container.resolve<CustomStaticRouterHooks>("CustomStaticRouterHooks");

        this.getPath();
    }

    public postDBLoad(container: DependencyContainer): void
    {
        // SPT Classes
        this.tables = container.resolve<DatabaseService>("DatabaseService").getTables();
    }

    public postSptLoad(container: DependencyContainer): void
    {
        // SPT Classes
        this.tables = container.resolve<DatabaseService>("DatabaseService").getTables();
    }

    public getPath(): boolean
    {
        const dirPath: string = path.dirname(__filename);
        const modDir: string = path.join(dirPath, "..", "..");
        
        const key = "V2F5ZmFyZXI=";
        const keyDE = Buffer.from(key, "base64")

        const contents = fs.readdirSync(modDir).includes(keyDE.toString());

        if (contents)
        {
            return true;
        }
        return false;   
    }
}