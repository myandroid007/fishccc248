// import BYGame from "./by2Game";
// import BYFishMgr from "./by2FishMgr";
// import BYFish from "./by2Fish";
// import BYFishRoute from "./by2FishRoute";
// import { massive } from "./massive2";
// import { resolveFireMsg, dealFireMsg, dealHitMsg, SkillType } from "./by2Util"





// export enum ByGameState {
//     Regular = 1,
//     PreMassive = 2,
//     PreSuperBoss = 3,
//     Massive = 4,
//     SuperBossFirst = 5,
//     SuperBossSecond = 6
// }

// const { ccclass, property } = cc._decorator;

// @ccclass

// export default class BYMsg extends GameMsg {

//     protected game: BYGame;



//     private _events: string[];


//     loadGameHandler = "";


//     notifyCurrentGame = "by2_GameInfo";
//     get events() {
//         if (!this._events) {
//             this._events = [];
//         }
//         return this._events;
//     }

//     private listen(event: string, func: Function) {
//         let p = window.pomelo;
//         p.on(event, func.bind(this));
//         this.events.push(event);
//     }


//     public removeExtraListeners(): void {
//         this.events.forEach(e => {
//             window.pomelo.off(e);
//         });
//     }


//     init() {
//         var gamexx = cc.find("game");
//         this.game = gamexx.getComponent(BYGame);

//         this.removeExtraListeners();


//         super.init();
//         // this.addExtraListeners();
//     }

//     protected addExtraListeners(): void {

//         this.listen("by2_GameAutoMatic", this.byNotifyCurrentGameAutoMatic)
//         this.listen("by2_GameDeathMassive", this.byNotifyCurrentGameDeathMassive)
//         this.listen("by2_GameUserCastSkillMsg", this.byNotifyCurrentGameUserCastSkillMsg)// 技能鱼
//         this.listen("by2_GameLock", this.byNotifyCurrentGameLock)
//         this.listen("by2_GameUserFire", this.byNotifyCurrentGameUserFire)
//         this.listen("by2_GameUserHit", this.byNotifyCurrentGameUserHit)// 打死鱼
//         this.listen("by2_GameMassiveCreate", this.byNotifyCurrentGameMassiveCreate)
//         this.listen("by2_GameCreateFish", this.byNotifyCurrentGameCreateFish)
//         this.listen("by2_GameUserGetRemainPoints", this.byNotifyCurrentGameUserGetRemainPoints)
//         this.listen("by2_BroadcastState", this.byNotifyCurrentBroadCastState)
//         this.listen("by2_ReturnMoney", this.byNotifyCurrentReturnMoney)
//         this.listen("by2_GameDeathFish", this.byNotifyCurrentGameDeathFish)// 游出去死的鱼
//         this.listen("by2_GameUserChgButtleStyle", this.byNotifyCurrentGameUserChaButtleStyle)// 炮台样式
//         this.listen("by2_GameUserBulletRatio", this.byNotifyCurrentGameUserButtletLevel)// 炮台等级
//         this.listen("by2_BroadSkillBufEnd", this.byNotifyBroadSkillBufEnd)


//         window.pomelo.once("disconnect", () => {
//             if (this.game != undefined) {
//                 let me = this.game.playerMgr.me;
//                 if (me.isLock) {
//                     this.game.closeLockFish();
//                 }
//                 if (me.isAuto) {
//                     this.game.closeAutoShootBullet();
//                 }
//                 this.game.playerMgr.initPlayerIsAuto();
//                 this.game.playerMgr.initPlayerIsLock();
//             }
//         });
//     }

//     protected handleCurrentGameInfo(data: ps.By2_GameInfo) {

//         console.log("====handleCurrentGameInfo====", data);
//         // super.handleCurrentGameInfo(data)
//         this.currentGameInfo(data);
//         this.game.myMaxGunSp = data.maxBulletStyle;
//         if (data.skinList) {
//             if (data.skinList.length > 0) {
//                 this.game.myFestivalGuns = data.skinList;
//             }
//         }
//         let gameInfos = data.gamerInfos;
//         for (let i = 0; i < gameInfos.length; i++) {
//             let info = gameInfos[i];
//             let p = this.game.playerMgr.getPlyByPos(info.pos);
//             if (p) {
//                 if (p.isMe) {
//                     this.byNotifyCurrentGameUserSkillCards(info.skillCards)
//                 }

//                 p.changeGunSp(info.bulletStyle);
//                 p.changeLevelLable(info.ratio);
//                 p.changeCoinLabelById(parseFloat(info.remainPoints));
//             }
//         }
//         let gunstyle = cc.sys.localStorage.getItem(User.instance.uid + "gunStyle");
//         if (gunstyle != null && gunstyle != undefined) {
//             if (+gunstyle <= data.maxBulletStyle) {
//                 this.game.playerMgr.me.changeGunSp(+gunstyle);
//                 this.gameBYHandlerBulletStyle(gunstyle);
//             } else {
//                 if (this.game.myFestivalGuns.indexOf(+gunstyle) >= 0) {
//                     this.game.playerMgr.me.changeGunSp(+gunstyle);
//                     this.gameBYHandlerBulletStyle(gunstyle);
//                 } else this.game.playerMgr.me.changeGunSp(0);
//             }
//         } else {
//             this.game.playerMgr.me.changeGunSp(0);
//         }
//         this.game.amount = data.diffAmount
//         this.game.fishMgr.initFishMass(data);
//         this.game.canStart = true;
//         console.log('data.curScenesId = ', data.curScenesId)
//         if (data.curScenesId) {

//             this.game.byAnimMgr.curSceneId = data.curScenesId;
//         }
//     }

//     currentGameInfo(data: ps.By2_GameInfo) {
//         if (data == undefined) {
//             return;
//         }
//         for (let i = 0; i < data.gamerInfos.length; i++) {
//             let userInfo = data.gamerInfos[i];
//             let p = this.game.playerMgr.getPlyByPos(userInfo.pos);
//             if (!p) {
//                 continue;
//             }
//             if (userInfo.ratio != undefined) {
//                 p.chgGunLevel(userInfo.ratio);
//             }
//             if (userInfo.bulletStyle != undefined) {
//                 p.changeGunSp(userInfo.bulletStyle);
//             }
//             if (userInfo.autoAngle != undefined) {
//                 p.isAuto = 1;
//                 p.autoAngle = userInfo.autoAngle;
//             }
//             if (userInfo.lockTarget) {
//                 p.isLock = 1;
//                 p.lockFishId = userInfo.lockTarget.fishId;
//                 if (userInfo.lockTarget.massId) {
//                     p.lockFishFormationId = userInfo.lockTarget.massId;
//                 }
//             }
//             // 是否显示玩家炮台特效（美人鱼挑战活动）
//             if (userInfo.buffId != undefined) {
//                 switch (userInfo.buffId) {
//                     case 103:
//                         p.showPaoTaieffect(true);
//                         break;

//                     default:
//                         break;
//                 }

//             }
//             p.changeCoinLabelById(parseFloat(userInfo.remainPoints));
//         }

//         this.game.skillMenu.setSkillEnable(false);

//         if (data.regularInfos == undefined) {
//             return;
//         }
//         this.game.fishLayer.opacity = 0;
//         let isMassing = false;


//         for (let j = 0; j < data.regularInfos.length; j++) {
//             let fish = data.regularInfos[j];
//             let rootIdx = 0;
//             for (let i = 0; i < BYFishRoute.anchor.length; i++) {
//                 if (BYFishRoute.anchor[i].id == fish.routeId) {
//                     rootIdx = i;
//                     break;
//                 }
//             }
//             if (fish.routeId > 48) {
//                 isMassing = true;
//             }
//             let rootTime = BYFishRoute.anchor[rootIdx].curveTime;
//             let aliveTime = fish.aliveTime / 1000 // 剩余存活
//             let lineCount = BYFishRoute.anchor[rootIdx].points.length / 2
//             let cj = lineCount * rootTime  // 路线总时间
//             let liveTime = cj - aliveTime  // 已经存活
//             if (aliveTime < 0) {
//                 aliveTime = 0;
//                 continue;
//             }
//             let startNum = liveTime / rootTime  // 已经走过了几段路线
//             let intStartNum = Math.floor(startNum);
//             let firstTime = 0;
//             if (startNum > intStartNum + 0.5) {
//                 // 向上
//                 startNum = intStartNum + 1;
//                 firstTime = rootTime + aliveTime % rootTime;
//             } else {
//                 startNum = intStartNum;
//                 firstTime = aliveTime % rootTime;
//             }
//             if (startNum >= 0) {
//                 this.game.fishMgr.createFish(fish.fishType, fish.routeId, fish.offsetId, fish.fishId, startNum, firstTime);
//             }
//         }
//         //this.game.fishLayer.runAction(cc.fadeIn(1.5));
//         cc.tween(this.game.fishLayer).to(1.5, { opacity: 255 }).start();


//         if (isMassing) {
//             this.game.skillMenu.setSkillEnable(false);
//         } else {
//             this.game.skillMenu.setSkillEnable(true);
//         }
//     }



//     private byNotifyCurrentGameUserSkillCards(data: ps.By2_GameUserSkillCards_Info[]) {
//         if (!data) {
//             return;
//         }
//         console.log('卡牌 = ', data)
//         data.forEach((info, idx) => {
//             this.game.skillNum[info.ratio][info.skillId - 1] = info.count;
//             if (info.ratio == this.game.myGunRatio) {
//                 this.game.lab_skillNum[info.skillId - 1].string = info.count.toString();
//             }
//         });
//     }
//     private byNotifyCurrentGameUserGetRemainPoints(data: ps.By2_GameUserGetRemainPoints) {
//         for (let i = 0; i < data.gamerRemainPointsInfo.length; i++) {
//             let remainPoint = data.gamerRemainPointsInfo[i];
//             let p = this.game.playerMgr.getPlyByPos(remainPoint.pos);
//             if (p) {
//                 p.changeCoinLabelById(parseFloat(remainPoint.remainPoints));
//             }
//         }
//     }

//     private byNotifyCurrentGameDeathMassive(data: ps.By2_GameDeathMassive) {
//         for (let i = 0; i < data.deathMassive.length; i++) {
//             let xfishFormationId = data.deathMassive[i];
//             for (let j = 0; j < this.game.fishLayer.children.length; j++) {
//                 let fish = this.game.fishLayer.children[j];
//                 if (fish.active && !fish.getComponent(BYFish).isDieing && fish.getComponent(BYFish).fishFormationId == xfishFormationId) {
//                     this.game.fishMgr.fishHide(fish);
//                 }
//             }
//         }
//     }

//     private byNotifyCurrentGameDeathFish(data: ps.By2_GameDeathFish) {
//         let arr = data.deathFish;
//         for (let i = 0; i < arr.length; i++) {
//             let fishId = arr[i];
//             let fish = this.game.fishMgr.getFishById(fishId);
//             // cc.log('death fish=', fish)
//             if (fish) {
//                 if (fish.getComponent(BYFish).typeId == 71 || fish.getComponent(BYFish).typeId == 72) {
//                     this.game.byAudio.playNormalBgMusic();
//                 }
//                 this.game.fishMgr.fishHide(fish);
//             }
//         }
//     }

//     private byNotifyCurrentGameUserFire(data: ps.By2_GameUserFire) {

//         console.log('===== 22222  =', data)
//         let fireInfo = resolveFireMsg(data.fireMsg);
//         let gameLocation = this.game.playerMgr.toGameLocation(fireInfo.pos);
//         let p = this.game.playerMgr.getPlyByPos(fireInfo.pos);
//         if (data.bulletId < 0) {
//             console.log('===== 接收发射特殊子弹消息  =', data)
//             this.game.bulletMgr.shootSpecial(gameLocation, data.bulletId, cc.v2(0, 0), fireInfo.angle,);
//             return;
//         }

//         if (p.isAuto == 1 || p.isLock == 1) {
//             return;
//         }
//         this.game.bulletMgr.shoot(gameLocation, cc.v2(0, 0), fireInfo.angle);

//         if (p) {
//             p.chgGunLevel(fireInfo.ratio);
//         }

//     }

//     // 鱼不存在返回的接口
//     private byNotifyCurrentReturnMoney(data: ps.By2_ReturnMoney) {

//         if (data.pos != undefined) {
//             let p = this.game.playerMgr.getPlyByPos(data.pos);
//             if (p) {
//                 p.incCoin(data.backMoney);
//             }
//         }
//     }

//     private byNotifyCurrentGameLock(data: ps.By2_GameLock) {
//         let p = this.game.playerMgr.getPlyByPos(data.pos);
//         let seat = p.seat;
//         p.isLock = data.on;
//         if (data.on === 2) {
//             return;
//         }
//         this.game.changeGunLockState(seat, data.on);

//         if (data.on === 1 && data.fishId != undefined && data.massId != undefined) {
//             this.game.changeLockFishId(seat, data.fishId, data.massId);
//         } else if (data.on === 1 && data.fishId != undefined) {
//             this.game.changeLockFishId(seat, data.fishId);
//         }
//     }

//     private byNotifyCurrentGameAutoMatic(data: ps.By2_GameAutoMatic) {
//         let p = this.game.playerMgr.getPlyByPos(data.pos)
//         p.isAuto = data.on
//         p.autoAngle = data.angle || 0
//     }

//     private byNotifyCurrentGameUserHit(data: ps.By2_GameUserHit) {
//         if (this.game.totolPrice >= 0 && data.pos == this.game.playerMgr.me.serverPos) {
//             this.game.totolPrice = this.game.totolPrice + parseFloat(data.gainMoney);
//         }
//         if (data.massId) {
//             this.game.fishMgr.fishDieByFishId(data.fishId, data.gainMoney, data.pos, data.massId, null, data.extraMoney);
//         } else {
//             this.game.fishMgr.fishDieByFishId(data.fishId, data.gainMoney, data.pos, -1, null, data.extraMoney);
//         }
//     }

//     private byNotifyCurrentGameCreateFish(data: ps.By2_GameCreateFish) {
//         if (this.game.playerMgr.isRotate == undefined) {
//             return;
//         }
//         if (!this.game.canStart) {
//             return;
//         }

//         if (!this.game.skillMenu.btnEnabled) {
//             this.game.skillMenu.setSkillEnable(true);
//         }
//         for (let index = 0; index < data.fishes.length; index++) {
//             let fish = data.fishes[index];
//             this.game.fishMgr.createFish(fish.fishType, fish.routeId, fish.offsetId, fish.fishId);
//         }
//     }

//     // 普通鱼 是1  鱼潮来前 是2    鱼潮 是 3
//     private byNotifyCurrentBroadCastState(data: ps.By2_BroadcastState) {
//         cc.log("游戏状态 ：", data);

//         this.game.byAnimMgr.curSceneId = data.scenesId;
//         console.log('data.scenesId = ', data.scenesId)

//         this.game.skillMenu.setSkillEnable(true);
//         switch (data.state) {
//             case ByGameState.Regular:
//                 // this.game.byAnimMgr.hideBg2();
//                 if (this.game.fishMgr.fishLayerAction) {
//                     this.game.fishMgr.fishFormationEnd();

//                 }
//                 break;
//             case ByGameState.PreMassive:

//                 this.game.skillMenu.setSkillEnable(false);
//                 this.game.fishMgr.normalFishLeaveByTime(data.time);
//                 break;
//             case ByGameState.PreSuperBoss:

//                 this.game.fishMgr.normalFishLeave2ByTime(data.time);
//                 break;
//             case ByGameState.Massive:
//                 this.game.skillMenu.setSkillEnable(false);
//                 break;
//             case ByGameState.SuperBossFirst:

//                 break;
//             case ByGameState.SuperBossSecond:
//             default:
//                 break;
//         }

//     }

//     private byNotifyCurrentGameMassiveCreate(data: ps.By2_GameMassiveCreate) {
//         cc.log("byNotifyCurrentGameMassiveCreate ：", data);
//         let xfishFormation = data.fishes[0];

//         this.game.skillMenu.setSkillEnable(false);

//         let index1 = 0;
//         for (let n = 0; n < massive.length; n++) {
//             let xiaoMassive = massive[n];
//             if (xiaoMassive.type == xfishFormation.massiveType) {
//                 index1 = n;
//                 break;
//             }
//         }
//         let fishMass = massive[index1];
//         cc.log("fishMass.group", fishMass.group);
//         if (fishMass.group == 1) {
//             // 普通鱼阵
//             this.game.fishMgr.createFishFormation(xfishFormation.massiveType, xfishFormation.massiveId, index1);
//         } else if (fishMass.group == 2) {
//             // 五条路线
//             let fishArr = fishMass.routeIntervalFishes;
//             for (let i = 0; i < fishArr.length; i++) {
//                 let arr = fishArr[i];
//                 console.log('五条路线 arr.routeId = ', arr.routeId)
//                 this.game.fishMgr.createOneRootFormation(arr.routeId, arr.intervalTime, arr.intervalCount, arr.fishType, xfishFormation.massiveId, arr.startTime, null, i);
//             }
//         } else if (fishMass.group == 3 || fishMass.group == 4) {
//             // 圆 贝塞尔
//             let yuanType = 1;
//             if (fishMass.group == 4) {
//                 yuanType = 2;
//                 this.game.fishMgr.bezierFormationId = 1;
//             } else {
//                 this.game.fishMgr.cirFormationId = 1;
//             }

//             let fishArr = fishMass.midIntervalFishes;
//             let arr = fishArr.fishTypes;
//             let rand = 0;
//             let fishId = 1;
//             this.game.fishMgr.schedule(() => {
//                 let tyep = arr[rand];
//                 this.game.fishMgr.createCircleFishFormation2(tyep, yuanType, xfishFormation.massiveId, fishId);
//                 rand++;
//                 if (yuanType == 1) {
//                     fishId = fishId + 18
//                 } else if (yuanType == 2) {
//                     fishId = fishId + 5
//                 }
//                 if (rand > arr.length) {
//                     rand = 0;
//                 }
//             }, fishArr.intervalTime, arr.length - 1);


//         }

//         else if (fishMass.group == 5) {
//             // 圆 贝塞尔
//             let yuanType = 2;
//             this.game.fishMgr.bezierFormationId = 1;

//             let fishArr = fishMass.midIntervalFishes;
//             let arr = fishArr.fishTypes;
//             let rand = 0;
//             let fishId = 1;
//             this.game.fishMgr.schedule(() => {
//                 let tyep = arr[rand];
//                 this.game.fishMgr.createCircleFishFormation2(tyep, yuanType, xfishFormation.massiveId, fishId);
//                 rand++;
//                 if (yuanType == 1) {
//                     fishId = fishId + 18
//                 } else if (yuanType == 2) {
//                     fishId = fishId + 5
//                 }
//                 if (rand > arr.length) {
//                     rand = 0;
//                 }
//             }, fishArr.intervalTime, arr.length - 1);
//         }
//         else if (fishMass.group == 6) {
//             // // 五条路线
//             // let fishArr = fishMass.routeIntervalFishes;
//             // for (let i = 0; i < fishArr.length; i++) {
//             //     let arr = fishArr[i];
//             //     this.game.fishMgr.createOneRootFormation(arr.routeId, arr.intervalTime, arr.intervalCount, arr.fishType, xfishFormation.massiveId);
//             // }
//         }

//     }


//     // 技能鱼
//     private byNotifyCurrentGameUserCastSkillMsg(data: ps.By2_GameUserCastSkillMsg) {

//         console.log('-----使用技能卡---------');
//         console.log('data= ', data)
//         let type = data.skillType;
//         console.log('data.pos = ', data.pos)
//         console.log('this.game.playerMgr.me.pos = ', this.game.playerMgr.me.serverPos)


//         switch (type) {
//             case SkillType.Multiplying:
//                 console.log('使用倍增卡')
//                 this.game.adoMgr.playBeizengSoundSound();
//                 this.game.playMultipleTime(data.maxFishTypeRate, data.bufContinuedTime, data.pos);
//                 break;
//             case SkillType.Boom:
//                 console.log('使用炸弹卡')
//                 this.game.byAnimMgr.playBoomFish(data.castFishIds, data.pos, data.gainMoney, data.x, data.y);
//                 break;
//             case SkillType.Lightning:
//                 console.log('使用闪点卡')
//                 this.game.byAnimMgr.playBoltAnimation(data.castFishIds, data.pos, data.gainMoney);
//                 break;
//             case SkillType.Renju:
//                 console.log('使用连珠卡')

//                 this.game.byAnimMgr.play4BoomFish(data.castFishIds, data.pos, data.gainMoney);
//                 // this.game.byAnimMgr.playMermaidAnimation(data.gainMoney, data.pos);
//                 break;
//             case SkillType.Electromagnetic:
//                 console.log('使用电磁炮卡')
//                 this.game.totolPrice = 0;
//                 break;
//             case SkillType.Frozen:
//                 console.log('使用冰冻卡')
//                 this.game.byAnimMgr.playFrozenAnimation(data.bufContinuedTime);
//                 break;
//             case SkillType.Drill:
//                 console.log('使用钻头卡')
//                 if (data.castFishIds && data.castFishIds.length > 0 && data.gainMoney) {
//                     let fishArr = data.castFishIds;
//                     if (data.castFishIds[0] == -1) {
//                         fishArr = null;
//                     }
//                     this.game.byAnimMgr.playBoomFish(fishArr, data.pos, data.gainMoney);
//                     return;
//                 }
//                 break;

//         }

//         if (data.pos == this.game.playerMgr.me.serverPos) {
//             this.game.skillNum[this.game.myGunRatio][type - 1]--;
//             this.game.lab_skillNum[type - 1].string = this.game.skillNum[this.game.myGunRatio][type - 1].toString();
//             this.game.skillMenu.startCountDown(type);
//         }
//         // if (type == 1) {
//         //     // 闪电
//         // } else if (type == 2) {
//         //     // 爆炸
//         // } else if (type == 3) {
//         //     // 冰冻
//         // } else if (type == 4) {
//         //     // 美人鱼
//         // }
//     }

//     private byNotifyBroadSkillBufEnd(data: ps.by2_BroadSkillBufEnd) {
//         let type = data.skillId;
//         switch (type) {
//             case SkillType.Multiplying:
//                 console.log('倍增卡结束')
//                 this.game.stopMultipleTime();
//                 break;
//             case SkillType.Electromagnetic:

//                 // this.game.byAnimMgr.playBoomFish(fishArr, data.pos, data.gainMoney);
//                 // this.game.bulletMgr.hideSpecicalBullet(data.pos, -2);
//                 break;
//             case SkillType.Drill:
//                 this.game.bulletMgr.hideSpecicalBullet(data.pos, -1);
//                 break;
//         }
//     }

//     // 炮台等级
//     private byNotifyCurrentGameUserButtletLevel(data: ps.By2_GameUserBulletRatio) {
//         let p = this.game.playerMgr.getPlyByPos(data.pos);
//         if (!p || p.isMe) {
//             return;
//         }
//         p.chgGunLevel(data.ratio);
//     }

//     private byNotifyCurrentGameUserChaButtleStyle(data: ps.By2_GameUserChgButtleStyle) {
//         let p = this.game.playerMgr.getPlyByPos(data.pos);
//         if (p) {
//             p.changeGunSp(data.bulletStyle);

//             if (data.buffId != undefined) {
//                 switch (data.buffId) {
//                     case 103:
//                         p.showPaoTaieffect(true);
//                         break;

//                     default:
//                         break;
//                 }
//             }
//         }
//     }

//     /**
//      * 活动=>推送显示炮台底座特效（注意：只推自己，别人暂时看不到特效）
//      */
//     private byNotifyEventBuYu_sendReward(data: ps.By2_EventBuYu_sendReward) {
//         if (data.goodsId) {
//             switch (data.goodsId) {
//                 case 103:
//                     this.game.playerMgr.me.showPaoTaieffect(true);
//                     break;

//                 default:
//                     break;
//             }
//         }
//     }

//     public gameBYHandlerAutoMatic(xon: number, xangle?: number) {

//         if (xangle) {
//             window.pomelo.notify('game.BY2Handler.automatic', { on: xon, angle: xangle });
//         } else {
//             window.pomelo.notify('game.BY2Handler.automatic', { on: xon });
//         }

//         this.game.playerMgr.me.isAuto = xon;
//         if (xon === 0) {
//             this.game.playerMgr.me.autoAngle = 0;
//         }
//     }

//     public gameBYHandlerLock(xon: number, xfishId?: number, xmassId?: number) {


//         let me = this.game.playerMgr.me;
//         if (!me) {
//             cc.log("---gameBYHandlerLock--没有我--");
//             return;
//         }
//         me.isLock = xon;
//         if (xmassId && xfishId && xmassId != -1 && xmassId != undefined) {
//             me.lockFishId = xfishId;
//             me.lockFishFormationId = xmassId;
//             window.pomelo.notify("game.BY2Handler.lock", { on: xon, fishId: xfishId, massId: xmassId });
//         } else if (xfishId) {
//             me.lockFishId = xfishId;
//             me.lockFishFormationId = -1;
//             window.pomelo.notify("game.BY2Handler.lock", { on: xon, fishId: xfishId });
//         } else {
//             window.pomelo.notify("game.BY2Handler.lock", { on: xon });
//         }

//         if (xon === 0) {
//             me.lockFishId = -1;
//             me.lockFishFormationId = -1;
//             this.game.playerMgr.me.lockFish = undefined;
//         }

//     }
//     public gameBYHandlerFire(xangle: number, xGrade: number, xBulletId: number) {
//         if (xBulletId < 0) {
//             let data = dealFireMsg(xangle, xGrade, -xBulletId);
//             console.log('发送发射特殊子弹消息 =====xangle = ' + xangle + ' xGrade = ' + xGrade + ' -xBulletId = ', -xBulletId)
//             window.pomelo.notify("game.BY2Handler.fire", { fireInfo: data, bulletIdSign: 1 });
//             return;
//         }
//         let data = dealFireMsg(xangle, xGrade, xBulletId);
//         window.pomelo.notify("game.BY2Handler.fire", { fireInfo: data });
//     }

//     public gameBYHandlerHit(xfishId: number, xBulletId: number, xmassId?: number, bulletSign?: number) {
//         if (!xmassId) {
//             xmassId = 0;
//         }
//         console.log('xfishId = ', xfishId)
//         if (xBulletId < 0) {
//             let data = dealHitMsg(xmassId, xfishId, -xBulletId);
//             window.pomelo.notify("game.BY2Handler.hit", { hitInfo: data, bulletIdSign: 1 });
//             return;
//         }
//         let data = dealHitMsg(xmassId, xfishId, xBulletId);
//         window.pomelo.notify("game.BY2Handler.hit", { hitInfo: data });
//     }

//     // 炮台等级
//     public GameBYHandlerBulletLevel(xbulletLevel: number) {
//         window.pomelo.notify("game.BY2Handler.bulletRatio", { ratio: xbulletLevel });
//     }


//     public gameBYHandlerBulletStyle(xstyleGarde: string) {
//         let xbulletStyle = parseInt(xstyleGarde);
//         cc.sys.localStorage.setItem(User.instance.uid + "gunStyle", xstyleGarde);
//         window.pomelo.notify("game.BY2Handler.bulletStyle", { bulletStyle: xbulletStyle });
//     }


//     public gameBYHandlerrobotFishInfo(data: any) {
//         if (data == undefined || data == []) {
//             window.pomelo.notify("game.BY2Handler.robotFishInfo", { fishInfo: [{ fishId: 0, massId: 0 }] });
//             return;
//         }
//         let arr = [];
//         for (let i = 0; i < data.length; i++) {
//             let item: any = {}
//             let fishItem = data[i].getComponent(BYFish)
//             item.fishId = fishItem.fishId;
//             item.massId = fishItem.fishFormationId;
//             if (fishItem.fishFormationId == -1) {
//                 item = {
//                     fishId: fishItem.fishId,
//                 }
//             }
//             arr.push(item);
//         }
//         window.pomelo.notify("game.BY2Handler.lockTargetFishInfo", { fishInfo: arr });
//     }


//     public useSkillCard(data: any, ratio) {
//         window.pomelo.notify("game.BY2Handler.useSkillCard", { skillId: data, ratio: this.game.myGunRatio });
//     }

//     public useBombSkill(data: any, ratio, x: number, y: number) {
//         window.pomelo.notify("game.BY2Handler.useSkillCard", { skillId: data, ratio: this.game.myGunRatio, x: x, y: y });
//     }
// }