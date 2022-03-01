// import ItemNames from "../../common/script/common/itemNames";
// import g from "../../common/script/g";
// import BYFishMgr from "./by2FishMgr";
// import { getFishKindType, isBoss } from "./by2Util"
// const { ccclass, property } = cc._decorator;


// export enum AUDIO_KEY {
//     KEY = "AUDIO_KEY",
//     MUSIC = "music",
//     SOUND = "sound",
// }
// export enum AUDIO_STATUS {
//     CLOSE,
//     OPEN,
// }



// @ccclass
// export default abstract class BYAudio extends cc.Component {

//     // @property({ type: cc.AudioClip })
//     // protected clipStart: cc.AudioClip = undefined;

//     // @property({ type: cc.AudioClip })
//     // protected clipClick: cc.AudioClip = undefined;

//     @property({ type: [cc.AudioClip] })
//     protected normalBgMArr: cc.AudioClip[] = [];  // 普通背景音乐
//     @property({ type: [cc.AudioClip] })
//     protected bossBgMArr: cc.AudioClip[] = []; // boss进行时的 背景音乐
//     @property({ type: [cc.AudioClip] })
//     protected bigFishDieSoundArr: cc.AudioClip[] = [];  // 大型鱼死亡
//     @property({ type: [cc.AudioClip] })
//     protected midFishDieSoundArr: cc.AudioClip[] = []; // 中型鱼死亡
//     @property({ type: cc.AudioClip })
//     protected bossDieSound: cc.AudioClip = undefined; // boss死亡
//     @property({ type: cc.AudioClip })
//     protected mermaidDieSound: cc.AudioClip = undefined; // 美人鱼死亡

//     @property({ type: [cc.AudioClip] })
//     protected coinSoundArr: cc.AudioClip[] = []; // 收金币
//     @property({ type: [cc.AudioClip] })
//     protected bulletSoundArr: cc.AudioClip[] = []; // 发子弹
//     @property({ type: [cc.AudioClip] })
//     protected hitSoundArr: cc.AudioClip[] = []; // 击中鱼
//     @property({ type: cc.AudioClip })
//     protected buttonClickSound: cc.AudioClip = undefined; // 按钮点击
//     @property({ type: cc.AudioClip })
//     protected boltSound: cc.AudioClip = undefined;  // 闪电

//     @property({ type: cc.AudioClip })
//     protected fishtideSound: cc.AudioClip = undefined; // 鱼潮
//     @property({ type: cc.AudioClip })
//     protected boomFishSound: cc.AudioClip = undefined; // 爆炸鱼爆炸
//     @property({ type: cc.AudioClip })
//     protected forzeSound: cc.AudioClip = undefined; // 冰冻
//     @property({ type: cc.AudioClip })
//     protected facaileSound: cc.AudioClip = undefined; // 发财了
//     @property({ type: cc.AudioClip })
//     protected bossComingSound: cc.AudioClip = undefined; // boss来临 动画的时候 的 音效
//     @property({ type: cc.AudioClip })
//     protected changeRatioSound: cc.AudioClip = undefined; // 点击 切换炮台的 倍率
//     @property({ type: cc.AudioClip })
//     protected bigFishDeathBoomSound: cc.AudioClip = undefined; // 用于61号金魁鲇及以上的鱼种死亡爆炸音

//     @property({ type: cc.AudioClip })
//     protected beizengSound: cc.AudioClip = undefined; // 用于61号金魁鲇及以上的鱼种死亡爆炸音


//     /** 钻头 */
//     @property({ type: cc.AudioClip })
//     protected zuantouSound: cc.AudioClip = undefined;
//     /** 电磁炮 */
//     @property({ type: cc.AudioClip })
//     protected diancipaoSound: cc.AudioClip = undefined;
//     /** 技能卡 */
//     @property({ type: cc.AudioClip })
//     protected skillBoardSound: cc.AudioClip = undefined;

//     private playingBgm: number;
//     private playCoinCoundIng = false;

//     private curBgmId: number = 0;


//     public static fishDeathSound: { [key: string]: number } = {
//         "24": 0, "31": 1, "32": 2, "33": 3, "34": 4, "35": 5, "42": 6, "43": 7, "44": 8, "45": 9, "46": 10, "51": 11, "52": 12, "53": 13, "61": 14,
//         "62": 15, "63": 16, "64": 17, "65": 18,
//     };

//     public fishDeathSoundOn: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


//     private static _configs: { [keyName: string]: number };
//     onLoad() {
//     }

//     onDestroy() {
//         cc.audioEngine.stopAll();
//     }

//     static loadConfig() {
//         let data: { [keyName: string]: number } = { "music": AUDIO_STATUS.OPEN, "sound": AUDIO_STATUS.OPEN };

//         let val = cc.sys.localStorage.getItem(ItemNames.audio);
//         if (val) data = JSON.parse(val);

//         BYAudio._configs = data;
//     }

//     protected playMusic(clip: cc.AudioClip, isLoop: boolean = false) {
//         this.stopMusic();
//         g.lobby.currBgmClip = clip;
//         BYAudio.loadConfig();
//         if (+BYAudio._configs[AUDIO_KEY.MUSIC] == AUDIO_STATUS.OPEN) {
//             if (isLoop) {
//                 this.playingBgm = cc.audioEngine.play(clip, true, 1);
//             } else {
//                 this.playingBgm = cc.audioEngine.play(clip, false, 1);
//                 // let time = cc.audioEngine.getDuration(this.playingBgm);

//                 this.scheduleOnce(this.playNormalBgMusic.bind(this), 60);
//                 // cc.audioEngine.setFinishCallback(this.playingBgm, this.playNormalBgMusic.bind(this));
//             }
//         }

//     }

//     public playNormalBgMusic() {
//         this.unschedule(this.playNormalBgMusic);

//         this.curBgmId++;
//         let id = this.curBgmId > this.normalBgMArr.length - 1 ? 0 : this.curBgmId;
//         this.curBgmId = id;
//         cc.log('------------------------playyyyyyyyyyyyyyy------', id)
//         this.playMusic(this.normalBgMArr[id], false);

//     }

//     public playBossingBgMusic(type: number) {
//         let rand = Math.random() * this.bossBgMArr.length;
//         rand = Math.floor(rand);

//         if (rand >= this.bossBgMArr.length) {
//             rand = 0;
//         }
//         this.playMusic(this.bossBgMArr[0], true);
//     }

//     public playBossComingSound() {


//         this.play(this.bossComingSound);
//     }

//     public playShootBulletSound(type: number) {
//         if (type > 3) type = 3
//         this.play(this.bulletSoundArr[type]);
//     }

//     // 0 少量  1 中量  2 少量
//     public playCoinSound(type: number) {

//         let time = 0.5;
//         if (type == 1) {
//             time = 1;
//         }
//         if (!this.playCoinCoundIng) {
//             this.playCoinCoundIng = true;
//             // this.play(this.coinSoundArr[type]);
//             this.play(this.coinSoundArr[0]);
//             this.scheduleOnce(() => {
//                 this.playCoinCoundIng = false;
//             }, time);
//         }

//     }

//     public playHitSound(type: number) {
//         this.play(this.hitSoundArr[type]);
//     }

//     // public playChangeGunSound() {

//     //     this.play(this.changeGunSound);
//     // }

//     public playChangeRatioSound() {
//         this.play(this.changeRatioSound);
//     }

//     public playButtonClickSound() {
//         this.play(this.buttonClickSound);
//     }

//     public playMidFishDieSound(fishType: number) {

//         let xx = fishType + "";
//         let index = BYAudio.fishDeathSound[xx];
//         if (index == undefined) {
//             return;
//         }
//         if (this.fishDeathSoundOn[index] == 0) {
//             this.fishDeathSoundOn[index] = 1;
//             this.play(this.midFishDieSoundArr[index]);
//             this.scheduleOnce(() => {
//                 this.fishDeathSoundOn[index] = 0;
//             }, 2);
//         }
//     }

//     public playBigFishDieSound() {
//         this.play(this.bigFishDieSoundArr[0]);
//     }

//     public playBoltSound() {
//         this.play(this.boltSound);
//     }

//     public playFishtideSound() {
//         this.play(this.fishtideSound);

//     }

//     public playSkillBoardSound() {
//         this.play(this.skillBoardSound);

//     }


//     public playDianCiPaoSound() {
//         this.play(this.diancipaoSound);

//     }
//     public playZuantouSound() {
//         this.play(this.zuantouSound);

//     }


//     public playBoomFishSound() {
//         this.play(this.boomFishSound);
//     }

//     public playForzeSound() {
//         this.play(this.forzeSound);
//     }

//     public playFacailiSound() {
//         this.play(this.facaileSound);
//     }

//     public playMeirenDieSound() {
//         this.play(this.mermaidDieSound);
//     }

//     // public playMeireningSound() {
//     //     let rand = Math.random() * 3;
//     //     rand = Math.floor(rand);
//     //     if (rand == 3) {
//     //         rand = 0;
//     //     }
//     //     this.play(this.mermaiSound[rand]);
//     // }

//     public playBossDieSound() {
//         this.play(this.bossDieSound);
//     }

//     public playBigFishDeathBoomSound() {
//         this.play(this.bigFishDeathBoomSound);
//     }

//     public playBeizengSoundSound() {
//         this.play(this.beizengSound);
//     }




//     pauseMusic() {
//         if (!this.playingBgm) {
//             return;
//         }
//         cc.audioEngine.pause(this.playingBgm);
//     }

//     resumeMusic() {
//         if (!this.playingBgm) {
//             return;
//         }
//         cc.audioEngine.resume(this.playingBgm);
//     }

//     stopMusic() {
//         if (!this.playingBgm) {
//             // cc.log("stopMusic = =this.playingBgm === ", this.playingBgm);
//             return;
//         }
//         cc.audioEngine.stop(this.playingBgm);
//     }

//     stopAllMusic() {
//         cc.audioEngine.stopAll();
//     }

//     // play(clip: cc.AudioClip, loop = false) {

//     //     if (soundCfg()) {
//     //         cc.audioEngine.play(clip, loop, 1);
//     //     }
//     // }

//     delFishDie(fishType: number) {
//         let tmpFish = getFishKindType(fishType);
//         if (tmpFish > 3 && tmpFish < 9) {
//             this.playBigFishDieSound();
//         }
//         this.playMidFishDieSound(fishType);
//         if (isBoss(fishType)) {
//             // this.playNormalBgMusic();
//             this.playBossDieSound();
//         } else if (fishType === BYFishMgr.mermaidType) {
//             this.playMeirenDieSound();
//         } else if (fishType > 60 && fishType != BYFishMgr.frozenType) {
//             this.playBigFishDeathBoomSound();
//         }
//     }


//     play(clip: cc.AudioClip, loop = false) {
//         BYAudio.loadConfig();
//         if (+BYAudio._configs[AUDIO_KEY.SOUND] == AUDIO_STATUS.OPEN) {
//             let audioId = cc.audioEngine.play(clip, loop, 1);
//         }

//     }

//     playVolume(clip: cc.AudioClip, loop = false, volume = 1) {
//         BYAudio.loadConfig();
//         if (+BYAudio._configs[AUDIO_KEY.SOUND] == AUDIO_STATUS.OPEN) {
//             let audioId = cc.audioEngine.play(clip, loop, volume);
//         }

//     }


// }