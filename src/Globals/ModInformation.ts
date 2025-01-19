import * as path from "path";
import modPackage = require("../../package.json");

export class ModInformation
{
    public modPath: string = path.join(path.dirname(__filename), "..", "..");
    public logPath: string = path.join(path.dirname(__filename), "..", "..", "logs");
    public versionNumber: string = modPackage.version;
}

