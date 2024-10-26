﻿using HarmonyLib;
using Klei.CustomSettings;
using ProcGen;
using System.IO;
using ProcGenGame;
using System.Linq;
using System;
using static STRINGS.UI.FRONTEND;

namespace _WorldGenStateCapture
{
	internal class Patches
	{
		/// <summary>
		/// Init. auto translation
		/// </summary>
		[HarmonyPatch(typeof(Localization), "Initialize")]
		public static class Localization_Initialize_Patch
		{
			private static void OverLoadStrings()
			{
				string code = Localization.GetLocale()?.Code;

				if (code.IsNullOrWhiteSpace()) return;

				string path = System.IO.Path.Combine(ModAssets.ModPath, "translations", Localization.GetLocale().Code + ".po");

				if (File.Exists(path))
				{
					Localization.OverloadStrings(Localization.LoadStringsFile(path, false));
					Debug.Log($"Found translation file for {code}.");
				}
			}
			public static void Postfix()
			{
				var root = typeof(STRINGS);
				Localization.RegisterForTranslation(typeof(STRINGS));
				OverLoadStrings();
				LocString.CreateLocStringKeys(root, null);
				Localization.GenerateStringsTemplate(root, System.IO.Path.Combine(KMod.Manager.GetDirectory(), "strings_templates"));

			}
		}



		#region SkipOrTheGameCrashesDueToNoSave

		[HarmonyPatch(typeof(RetireColonyUtility), nameof(RetireColonyUtility.SaveColonySummaryData))]
		public static class PreventSavingWorldRetiredColonyData
		{
			public static bool Prefix(ref bool __result)
			{
				__result = true;
				return false;
			}
		}
		[HarmonyPatch(typeof(RetireColonyUtility), nameof(RetireColonyUtility.StripInvalidCharacters))]
		public static class PreventCrashOnReveal
				{
			public static bool Prefix(ref string __result, string source)
			{
				__result = source;
				return false;
				}
		}
		[HarmonyPatch(typeof(Timelapser), nameof(Timelapser.RenderAndPrint))]
		public static class PreventCrashOnReveal2
				{
			public static bool Prefix()
			{
				return false;
			}
				}
		[HarmonyPatch(typeof(SaveLoader), nameof(SaveLoader.InitialSave))]
		public static class PreventSavingWorld
		{
			public static bool Prefix(SaveLoader __instance)
			{
				return false;
			}
		}
		#endregion

		[HarmonyPatch(typeof(Game), nameof(Game.StopBE))]
		public static class PreventDoubleShutdown
		{
			//there seems to be a rare occurence that the game tries to execute this method twice, dying on the second attempt in a second thread
			public static bool Prefix()
			{
				var sessionCounter = MNI_Statistics.Instance.SessionCounter;
				Console.WriteLine("stopping BE; "+sessionCounter + " " + seedcount);
				if(sessionCounter == seedcount)
				{
					Debug.LogWarning("Game tried to stop the backend twice, something is broken. Restarting the game...");
					App.instance.Restart();
					return false;
				}
				seedcount = sessionCounter;
				return true;
			}
			static int seedcount = -1;
		}

		[HarmonyPatch(typeof(WattsonMessage), nameof(WattsonMessage.OnDeactivate))]
		public static class QuitGamePt2
		{
			public static void Postfix()
			{

				Debug.Log("gathering world data...");
				foreach (var world in ClusterManager.Instance.m_worldContainers)
				{
					world.isDiscovered = true;
				}


				for (int i = 0; i < SaveGame.Instance.worldGenSpawner.spawnables.Count; i++)
				{
					SaveGame.Instance.worldGenSpawner.spawnables[i].TrySpawn();
				}


				GameScheduler.Instance.Schedule("collect data", 4, (_) =>
				{
					ModAssets.AccumulateSeedData();
				});
			}

		}
		[HarmonyPatch(typeof(WattsonMessage), nameof(WattsonMessage.OnActivate))]
		public static class QuitGamePt1
		{
			public static void Postfix(WattsonMessage __instance)
			{
				__instance.button.SignalClick(KKeyCode.Mouse2);
			}
		}

		[HarmonyPatch(typeof(MainMenu), nameof(MainMenu.OnSpawn))]

		public static class AutoLaunchParser
		{
			[HarmonyPriority(Priority.Low)]
			public static void Postfix(MainMenu __instance)
			{
				ModAssets.OnMainMenuLoaded();
				MNI_Statistics.MainMenuInitialize();

				autoLoadActive = false;
				if (ModAssets.ModDilution)
				{
					Debug.LogWarning("other active mods detected, aborting auto world parsing");

					Dialog(STRINGS.AUTOPARSING.MODSDETECTED.TITLE,
						STRINGS.AUTOPARSING.MODSDETECTED.DESC);
					return;
				}
				menuTimer = __instance.gameObject.AddOrGet<MNI_Timer>();				
				InitDelayedAutoStart(__instance);				
			}

			static void CancelAutoParsing()
			{
				if (menuTimer != null)
					menuTimer.Abort();
			}
			static void CloseDialogue()
			{
				if (Popup != null)
					UnityEngine.Object.Destroy(Popup.gameObject);
			}
			//copied from KMod.Manager to allow closing it externally;
			static void Dialog(string title = null, string text = null, string confirm_text = null, System.Action on_confirm = null, string cancel_text = null, System.Action on_cancel = null, string configurable_text = null, System.Action on_configurable_clicked = null, UnityEngine.Sprite image_sprite = null)
			{
				//close previous
				CloseDialogue();
				Popup = (ConfirmDialogScreen)KScreenManager.Instance.StartScreen(ScreenPrefabs.Instance.ConfirmDialogScreen.gameObject, Global.Instance.globalCanvas);
				Popup.PopupConfirmDialog(text, on_confirm, on_cancel, configurable_text, on_configurable_clicked, title, confirm_text, cancel_text, image_sprite);				
			}
			static ConfirmDialogScreen Popup = null;
			static MNI_Timer menuTimer = null;
			public static void InitDelayedAutoStart(MainMenu __instance)
			{
				//if the application memory takes more than 3/4 of the total system memory, restart after the next run
				 //RestartAfterGeneration = true


				//this is set to true after the first collection of the instance has been completed, skip the 10 second timer for subsequent runs in the same instance
				//to stop the process, restart the game
				if (ModAssets.lowMemRestartInitialized)
				{
					menuTimer.SetTimer(5);
					menuTimer.SetAction(() =>
					{
						InitAutoStart(__instance);
					});
					return;
				}


				if (menuTimer != null)
					menuTimer.Abort();
				menuTimer.SetTimer(10);
				menuTimer.SetAction(() =>
				{
					CloseDialogue();
					InitAutoStart(__instance);
				});
				
				Dialog(STRINGS.AUTOPARSING.INPROGRESSDIALOG.TITLE,
					STRINGS.AUTOPARSING.INPROGRESSDIALOG.DESC,
					STRINGS.AUTOPARSING.INPROGRESSDIALOG.STARTNOW,
					() => { CancelAutoParsing(); InitAutoStart(__instance); },
					NEWGAMESETTINGS.BUTTONS.CANCEL, CancelAutoParsing);
			}

			public static void InitAutoStart(MainMenu __instance)
			{
				//Used to generate dictionaries in Config class, uncomment to regenerate them when new dlc releases
				//Console.WriteLine("Cluster Dic:");
				//foreach (string clusterName in SettingsCache.GetClusterNames())
				//{
				//	ClusterLayout clusterData = SettingsCache.clusterLayouts.GetClusterData(clusterName);
				//	Console.WriteLine("{" + (DlcManager.IsExpansion1Active() ? "ClusterSelection_SO" : "ClusterSelection_Base") + "." + Strings.Get(clusterData.name).ToString().Replace(" - ", "_").Replace(" ", "_") + ", \"" + clusterData.coordinatePrefix + "\"},");
				//}
				//Console.WriteLine("NamesOnly");
				//foreach (string clusterName in SettingsCache.GetClusterNames())
				//{
				//	ClusterLayout clusterData = SettingsCache.clusterLayouts.GetClusterData(clusterName);
				//	Console.WriteLine(Strings.Get(clusterData.name).ToString().Replace(" - ", "_").Replace(" ", "_") + ",");
				//}

				autoLoadActive = false;
				var clusterPrefix = Config.TargetClusterPrefix();

				targetLayout = null;
				Debug.Log("autostarting...");
				bool ServerSeed = RequestHelper.HasServerRequestedSeed(out string coordinate);
				if(ServerSeed)
				{
					string[] array = CustomGameSettings.ParseSettingCoordinate(coordinate);
					if (array.Length < 4 || array.Length > 6 || !int.TryParse(array[2], out var _))
					{
						ServerSeed = false; //invalid coordinate
					}
					if(ServerSeed)
						clusterPrefix = array[1];
				}

				if (!Config.Instance.RandomizedClusterGen || ServerSeed)
				{
					foreach (string clusterName in SettingsCache.GetClusterNames())
					{
						ClusterLayout clusterData = SettingsCache.clusterLayouts.GetClusterData(clusterName);
						if (clusterData.coordinatePrefix == clusterPrefix)
						{
							targetLayout = clusterData;
							break;
						}
					}
				}
				else
				{
					while (targetLayout == null)
					{
						targetLayout = SettingsCache.clusterLayouts.clusterCache.GetRandom().Value;

						//skip empty dev clusters
						if (targetLayout.skip > 0)
						{
							targetLayout = null;
							continue;
						}
						//spaced out loads vanilla terra to the cache, skip that
						if (DlcManager.IsExpansion1Active() && targetLayout.coordinatePrefix == "SNDST-A")
						{
							targetLayout = null;
							continue;
						}
						//skip skewed asteroid and future clusters with a fixed seed
						if (targetLayout.fixedCoordinate != -1)
						{
							targetLayout = null;
							continue;
						}
					}
				}

				if (targetLayout == null)
					return;

				Debug.Log("autostart successful");
				autoLoadActive = true;
				clusterCategory = (int)targetLayout.clusterCategory;
				__instance.NewGame();
			}
		}
		static ClusterLayout targetLayout;
		static int clusterCategory = -1;
		static bool autoLoadActive;


		[HarmonyPatch(typeof(ClusterCategorySelectionScreen), nameof(ClusterCategorySelectionScreen.OnSpawn))]
		public static class SelectClusterType
		{
			public static void Postfix(ClusterCategorySelectionScreen __instance)
			{
				if (autoLoadActive && clusterCategory != -1)
				{
					__instance.OnClickOption((ClusterLayout.ClusterCategory)clusterCategory);
				}
			}
		}
		[HarmonyPatch(typeof(ModeSelectScreen), nameof(ModeSelectScreen.OnSpawn))]
		public static class SelectSurvivalSettings
		{
			public static void Postfix(ModeSelectScreen __instance)
			{
				if (autoLoadActive)
				{
					__instance.OnClickSurvival();
				}
			}
		}
		[HarmonyPatch(typeof(NewBaseScreen), nameof(NewBaseScreen.SpawnMinions))]
		public static class PreventMinionSpawnCrash
		{
			public static bool Prefix(ModeSelectScreen __instance)
			{
				if (autoLoadActive)
				{
					return false;
				}
				return true;
			}
		}
		[HarmonyPatch(typeof(ColonyDestinationSelectScreen), nameof(ColonyDestinationSelectScreen.OnSpawn))]
		public static class SelectCluster
		{
			public static void Postfix(ColonyDestinationSelectScreen __instance)
			{
				//always default those to 0

				//default "survival" settings
				__instance.newGameSettingsPanel.ConsumeSettingsCode("0");
				//no story traits by default
				__instance.newGameSettingsPanel.ConsumeStoryTraitsCode("0");
				//no mixings by default
				__instance.newGameSettingsPanel.ConsumeMixingSettingsCode("0");

				if (autoLoadActive)
				{
					bool serverRequestedRun = RequestHelper.HasServerRequestedSeed(out string serverCoordinate);
					if (serverRequestedRun)
					{
						Debug.Log("Running server requested seed: " + serverCoordinate);

						__instance.CoordinateChanged(serverCoordinate);
						__instance.newGameSettingsPanel.ConsumeSettingsCode("0");
						__instance.newGameSettingsPanel.ConsumeStoryTraitsCode("0");
						__instance.LaunchClicked();
						return;
					}
					__instance.newGameSettingsPanel.SetSetting((SettingConfig)CustomGameSettingConfigs.ClusterLayout, targetLayout.filePath);

					Debug.Log("Selected cluster: " + Strings.Get(targetLayout.name));

					//ceres clusters require dlc mixing to be enabled
					if (DlcManager.IsContentSubscribed(DlcManager.DLC2_ID))
					{					
						if (!MNI_Statistics.Instance.IsMixingRun())
						{
							Debug.Log("no mixing active this run");
							//if its a ceres cluster, turn off any mixing, otherwise leave them at default (adjust in the future if klei releases a second mixing dlc, rn ceres comes with everything disabled by default)
							if (!targetLayout.requiredDlcIds.Contains(DlcManager.DLC2_ID))
							{
								__instance.newGameSettingsPanel.ConsumeMixingSettingsCode("0");
							}
						}
						else
						{
							var settingsInstance = CustomGameSettings.Instance;
							foreach (var setting in CustomGameSettings.Instance.MixingSettings.Values)
							{
								if (setting.coordinate_range == -1) //settings that cannot be configured
								{
									continue;
								}
								if (setting is DlcMixingSettingConfig dlcSetting) //FP setting
								{
									Debug.Log("Turning on dlc mixing " + setting.id);
									settingsInstance.SetMixingSetting(dlcSetting, DlcMixingSettingConfig.EnabledLevelId);
									continue;
								}
								else if (setting is MixingSettingConfig mixingSetting)
								{
									//disable if forbidden by cluster
									if (targetLayout.clusterTags.Any(tag => mixingSetting.forbiddenClusterTags.Contains(tag)))
									{
										Debug.Log(setting.id + " is forbidden by the current cluster, disabling it.");
										settingsInstance.SetMixingSetting(mixingSetting, SubworldMixingSettingConfig.DisabledLevelId); //same id for world and subworld mixing setting
									}
									else
									{
										string randomLevel = mixingSetting.levels.GetRandom().id;
										Debug.Log("setting a random value for mixing setting " + setting.id + ": " + randomLevel);
										settingsInstance.SetMixingSetting(mixingSetting, randomLevel);
									}
								}
							}
						}
					}

					__instance.ShuffleClicked();
					__instance.LaunchClicked();
				}
			}
		}


		/// <summary>
		/// These patches have to run manually or they break translations on certain screens
		/// </summary>
		[HarmonyPatch(typeof(Assets), nameof(Assets.OnPrefabInit))]
		public static class OnAssetPrefabPatch
		{
			public static void Postfix()
			{
				SkipMinionScreen_StartProcess.AssetOnPrefabInitPostfix(Mod.harmonyInstance);
			}
		}

		//[HarmonyPatch(typeof(CharacterSelectionController), nameof(CharacterSelectionController.EnableProceedButton))]
		public static class SkipMinionScreen_StartProcess
		{

			public static void AssetOnPrefabInitPostfix(Harmony harmony)
			{
				var m_TargetMethod = AccessTools.Method("CharacterSelectionController, Assembly-CSharp:EnableProceedButton");
				var m_Postfix = AccessTools.Method(typeof(SkipMinionScreen_StartProcess), "Postfix");

				harmony.Patch(m_TargetMethod, null, new HarmonyMethod(m_Postfix));
			}

			public static void Postfix(CharacterSelectionController __instance)
			{
				if (__instance is MinionSelectScreen)
				{
					__instance.OnProceed();
				}
			}
		}
		#region skipGameOverChecks
		[HarmonyPatch(typeof(GameFlowManager.StatesInstance), nameof(GameFlowManager.StatesInstance.CheckForGameOver))]
		public static class SkipGameOverCheck
		{
			public static bool Prefix()
			{
				if (autoLoadActive)
				{
					return false;
				}
				return true;
			}
		}
		[HarmonyPatch(typeof(GameFlowManager), nameof(GameFlowManager.IsGameOver))]
		public static class SkipGameOverCheck2
		{
			public static bool Prefix(ref bool __result)
			{
				if (autoLoadActive)
				{
					__result = false;
					return false;
				}
				return true;
			}
		}
		#endregion

		[HarmonyPatch(typeof(OfflineWorldGen), nameof(OfflineWorldGen.DisplayErrors))]
		public static class RestartOnFailedSeed
		{
			/// <summary>
			/// triggered on errors during worldgen
			/// </summary>
			/// <param name="__instance"></param>
			/// <returns></returns>
			public static bool Prefix(OfflineWorldGen __instance)
			{
				ModAssets.AccumulateFailedSeedData(__instance);
				return false;
			}
		}
		[HarmonyPatch(typeof(KCrashReporter), nameof(KCrashReporter.ShowDialog))]
		public static class RestartOnCrash
		{
			public static void Prefix()
			{
				App.instance.Restart();
			}
		}
	}
}
