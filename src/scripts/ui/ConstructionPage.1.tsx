import { notifyGameStateUpdate, useGameState } from "../Global";
import { Config } from "../logic/Constants";
import { ITileData } from "../logic/Tile";
import { WorldScene } from "../scenes/WorldScene";
import { Singleton } from "../utilities/Singleton";
import { L, t } from "../utilities/i18n";
import { BuildingConstructionProgressComponent } from "./BuildingConstructionProgressComponent";
import { MenuComponent } from "./MenuComponent";

export function ConstructionPage({ tile }: { tile: ITileData }): React.ReactNode {
   if (tile.building == null) {
      return null;
   }
   const building = tile.building;
   const gs = useGameState();
   const definition = Config.Building[building.type];
   return (
      <div className="window">
         <div className="title-bar">
            <div className="title-bar-text">{definition.name()}</div>
         </div>
         <MenuComponent />
         <div className="window-body">
            <BuildingConstructionProgressComponent xy={tile.xy} gameState={gs} />
            <fieldset>
               <legend>{t(building.status === "paused" ? L.ResumeConstruction : L.PauseConstruction)}</legend>
               <div className="row">
                  <div>
                     {t(building.status === "paused" ? L.ResumeConstructionDesc : L.PauseConstructionDesc)}
                  </div>
                  <div className="ml10">
                     <button
                        onClick={() => {
                           building.status = building.status === "paused" ? "building" : "paused";
                           notifyGameStateUpdate();
                        }}
                     >
                        {t(
                           building.status === "paused"
                              ? L.ResumeConstructionResume
                              : L.PauseConstructionPause,
                        )}
                     </button>
                  </div>
               </div>
            </fieldset>
            <fieldset>
               <legend>{t(L.EndConstruction)}</legend>
               <div className="row">
                  <div>{t(L.EndConstructionDesc)}</div>
                  <div className="ml10">
                     <button
                        onClick={() => {
                           delete tile.building;
                           Singleton().sceneManager.getCurrent(WorldScene)?.resetTile(tile.xy);
                           notifyGameStateUpdate();
                        }}
                     >
                        {t(L.EndConstructionEnd)}
                     </button>
                  </div>
               </div>
            </fieldset>
         </div>
      </div>
   );
}