import BYFish from "./by2Fish"
import BYFishMgr from "./by2FishMgr"
import BYFishnetMgr from "./by2FishnetMgr"
import BYBulletMgr from "./by2BulletMgr"
// import BYMsg from "./by2Msg"
import BYPlayerMgr from "./by2PlayerMgr"
import BYAnimMgr from "./by2AnimMgr"
// import BYAudio from "./by2Audio"
// // import g from "../../script/g"
// import BYIdleCheck from "./by2IdleCheck"
// import BYGunHandbook from "./by2GunHandbook"
// import ScrollViewBox from "../../lobby/script/lobby/scrollViewBox"
import { getQuadrantDegree, isBoss, isFestivalGuns, isRebateGunArr, SkillType } from "./by2Util"
import BYPlayer from "./by2Player"
// // import ByFishSmart, { optionType } from "./by2FishSmart"
// import by2SkillMenu from "./by2SkillMenu"
// import by2fishHandbook from "./by2fishHandbook"
// import Game, { Games } from "../../common/script/game-share/game"
// import { showTip, showConfirm } from "../../common/script/common/util"
// import g, { QUITSHOW } from "../../common/script/g"
// import { WeeklyRebateModel } from "../../lobby/script/lobby/weeklyRebate/weeklyRebateModel"
// import GameHelp from "../../common/script/game-share/gameHelp"
// import by2Help from "./by2Help"
const { ccclass, property } = cc._decorator

@ccclass
export default class BYGame extends cc.Component {

    @property({ type: [BYPlayer], tooltip: "玩家节点组" })
    players: BYPlayer[] = [];

    // @property(cc.Prefab)
    // fishSmart: cc.Prefab = undefined;

    // @property({ type: BYAudio, override: true })
    // adoMgr: BYAudio = undefined;
    @property(cc.Node)
    public nodeCanvas: cc.Node = undefined;

    @property(cc.Node)
    nodeBg: cc.Node = undefined;

    @property(cc.Node)
    bulletLayer: cc.Node = undefined;

    @property(cc.Node)
    gunLayer: cc.Node = undefined;

    @property(cc.Node)
    dieLayer: cc.Node = undefined;

    @property(cc.Node)
    fishLayer: cc.Node = undefined;

    @property(cc.Node)
    fishnetLayer: cc.Node = undefined;

    @property(cc.Node)
    effectsLayer: cc.Node = undefined;

    @property(cc.Node)
    uiLayer: cc.Node = undefined;

    @property(cc.Node)
    HLAutoIcon: cc.Node = undefined;  // 高亮的自动图标

    @property(cc.Node)
    HLLockIcon: cc.Node = undefined;

    // @property(cc.Node)
    // smartButton: cc.Node = undefined;

    @property(cc.Node)
    pot: cc.Node = undefined;

    @property(cc.Node)
    animationAim: cc.Node = undefined;

    @property(cc.Node)
    lockNotice: cc.Node = undefined;

    @property(cc.Node)
    enumLayer: cc.Node = undefined;


    @property(cc.Node)
    btn_menu: cc.Node = undefined;

    @property(cc.Prefab)
    setting: cc.Prefab = undefined;

    @property(cc.Prefab)
    preFishHandbook: cc.Prefab = undefined;

    @property(cc.Prefab)
    preGunHandbook: cc.Prefab = undefined;

    @property(cc.Prefab)
    preHelp: cc.Prefab = undefined;

    @property([cc.Prefab])
    resArr: cc.Prefab[] = [];

    @property(cc.Node)
    node_particleMutiple: cc.Node = undefined;
    @property(cc.Node)
    node_miaozhun: cc.Node = undefined;

    @property(cc.Node)
    spr_miaozhun: cc.Node = undefined;

    @property([cc.Label])
    lab_skillNum: cc.Label[] = [];

    @property(cc.Node)
    node_skillBorad: cc.Node = null;

    // @property(by2SkillMenu)
    // skillMenu: by2SkillMenu = null;

    @property([cc.Label])
    lab_countdown: cc.Label[] = [];

    @property([cc.ProgressBar])
    progress_skill: cc.ProgressBar[] = [];


    public myGunRatio: number = 1;
    public skillNum = [];

    public gunCfg: { coin: string, level: number }[] = undefined;
    public amount: string;
    public halfSW: number
    public halfSH: number
    public static STEP_TIME = 1 / 6
    public myMaxGunSp: number = undefined;
    public fishMgr: BYFishMgr = undefined;
    public fishnetMgr: BYFishnetMgr = undefined;
    public bulletMgr: BYBulletMgr = undefined;
    public curTouchPos: cc.Vec2 = undefined;
    public canStart: boolean = true; // 是否可以开始发子弹 （处理gameinfo）
    public roomMaxRatio: number = 1;
    // public msg: BYMsg = undefined;
    public byAnimMgr: BYAnimMgr = undefined;
    // public byAudio: BYAudio = undefined;
    public clickFirstLockFish = false; // 自己是否 已经点击了 第一个锁定的鱼
    public sendLockFishs: cc.Node[] = [];
    public moenyNotLayerIsShow: boolean = false;
    // private byIdleCheck: BYIdleCheck = undefined;
    public tipCanShow: boolean = true;  // 子弹上限的提示 是可以显示
    // private byFishHandbook: by2fishHandbook = undefined;
    // public byGunHandbook: BYGunHandbook = undefined;
    // private gameHelp: by2Help = undefined
    public endGame: boolean = false;
    private gunResNodeArr: cc.Node[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];


    public multipleTime: boolean = false;
    public maxFishTypeRate: number = 0;

    private _curSkillMiaozhunID = -1;

    private num_countdown = 60;

    public static HALF_WIDTH = 568;

    public totolPrice: number = -1;


    clickInterview: number = 1;
    playerMgr: BYPlayerMgr = undefined;


    /**
  * 自己拥有的节日炮台皮肤
  */
    public myFestivalGuns: number[] = [];

    gameName = "name";
    setGameEnd() { }
    setRoomInfo() { }
    setStarted() { }
    refreshRoomInfo() { }
    hideTicker() { }
    setWaitPrepare() { }
    setWaitStart() { }
    showTicker() { }
    updateUI() { }
    initRound() {
        // if (this.playerMgr.seatOffset > 1) {
        //     this.playerMgr.isRotate = true;
        // }

    }
    onLoad() {
        this.playerMgr = new BYPlayerMgr(this);
        this.bulletMgr = this.bulletLayer.getComponent(BYBulletMgr);
        this.fishMgr = this.fishLayer.getComponent(BYFishMgr);
        this.fishnetMgr = this.fishnetLayer.getComponent(BYFishnetMgr);
        this.byAnimMgr = this.effectsLayer.getComponent(BYAnimMgr);
        this.byAnimMgr.initGame(this);
        // super.onLoad();
        let size = cc.view.getFrameSize();
        let r = size.width / size.height;
        if (r > 1.775) {
            BYGame.HALF_WIDTH = r * 320
        } else {
            BYGame.HALF_WIDTH = 568
        }
        let winSize = cc.winSize;
        this.halfSW = winSize.width / 2;
        this.halfSH = winSize.height / 2;
        cc.director.getCollisionManager().enabled = true;
        // // this.skillMenu.game = this;

        // // this.smartButton.active = true;
        // this.skillNum = [0];
        // for (let i = 1; i < 11; i++) {
        //     let num = [0, 0, 0, 0, 0, 0, 0];
        //     this.skillNum.push(num);
        // }


        // this.node_miaozhun.on('touchstart', this.onMiaozhunTouchStart, this);
        // this.node_miaozhun.on('touchmove', this.onMiaozhunTouchMove, this);
        // this.node_miaozhun.on('touchend', this.onMiaozhunTouchEnd, this);
        // this.node_miaozhun.active = false;

        // this.setSkillBoard();
    }
    start() {
        // super.start();
        // let yid = +this.yid > 4 ? 3 : +this.yid - 1;
        // this.nodeSeabed.getComponent(cc.Sprite).spriteFrame = this.seabeds[yid];
    }

    dealRoomData(data: any): void {
        // cc.log('by deal room', data)
        if (data.code === 200) {
            // this.playerMgr.isRotate = data.pos > 1;
            // this.playerMgr.handleMyInfo(data.rPos);
            // this.playerMgr.handleUserInfo(data.users);
            // this.byIdleCheck.kickTime = data.startKickTime / 1000;
            if (data.config) {
                let configx = JSON.parse(data.config);
                // cc.log('configx============', configx)
                //this.gunCfg = configx.bulletStyleDefs
                this.roomMaxRatio = configx.ratio;

            }
            // window.pomelo.request("game.BY2Handler.loadGameInfo", {}, (data: any) => {
            // });
        } else {
            cc.log("加载房间信息失败");
        }
    }

    initGame() {
        // cc.director.getCollisionManager().enabled = true;
        // this.msg = new BYMsg(this);
        // this.msg.init();
        // this.fishMgr = this.fishLayer.getComponent(BYFishMgr);
        // this.fishnetMgr = this.fishnetLayer.getComponent(BYFishnetMgr);
        // this.bulletMgr = this.bulletLayer.getComponent(BYBulletMgr);
        // this.byAudio = this.node.getChildByName("audio").getComponent(BYAudio);
        // this.byAnimMgr = this.effectsLayer.getComponent(BYAnimMgr);
        // this.byAnimMgr.initGame(this);
        // this.byIdleCheck = this.node.getComponent(BYIdleCheck);

        // this.playerMgr = new BYPlayerMgr(this);


        // this.sendLockFishs = [];
        // this.schedule(this.startCheck, BYGame.STEP_TIME);
        // // this.schedule(this.starCheckLock, BYGame.STEP_TIME);
        // this.schedule(this.checkLockFishs, 1);

        // this.byAudio.playNormalBgMusic();
        // this.playerMgr.playerAimCircleRotate();


        // //美人鱼挑战活动，炮台底座特效截止到每天的0点，将停止显示
        // let self = this;
        // let startTime = (new Date().getTime()) / 1000; //当前时间
        // let endTime = (new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000; //零点时间前一秒 23:59:59
        // let time = endTime - startTime;
        // //console.log("=====美人鱼挑战====今天距离“零点“（活动结束）时间为========>" +(time/60/60) + "");
        // this.scheduleOnce(() => {
        //     for (let i = 0; i < self.playerMgr.playerCount; i++) {
        //         let p = self.playerMgr.getPlayerBySeat(i);
        //         if (!p) {
        //             continue;
        //         }
        //         p.showPaoTaieffect(false);
        //     }
        // }, time);
    }

    // 初始化 子弹方向
    initMyTouchPos() {
        // this.curTouchPos = this.touch2GamePos(cc.v2(this.playerMgr.me.gunPos.x + this.halfSW, this.halfSH));
    }

    /**
     * 开始检测锁定和自动
     */
    public startCheck() {
        // for (let i = 0; i < this.playerMgr.playerCount; i++) {
        //     let p = this.playerMgr.getPlayerBySeat(i);
        //     if (!p) continue;
        //     if (p.isAuto == 1 && (p.isLock != 1 || (p.isLock == 1 && p.lockFish == undefined))) {
        //         if (p.isMe) {
        //             this.autoShootCallback();
        //         } else {
        //             this.bulletMgr.shoot(i, cc.v2(0, 0), p.autoAngle);
        //         }
        //     }
        //     if (p.isLock == 1) {
        //         if (p.isMe) {
        //             this.lockFishCallback();
        //         } else {
        //             let lockFish = p.lockFish;
        //             if (lockFish == undefined || !lockFish.liveInCurScene()) {
        //                 continue;
        //             }
        //             this.bulletMgr.changeBulletMove(p.seat);
        //             this.bulletMgr.shoot(p.seat, cc.v2(p.aimCircle.position), 0);
        //         }
        //     }
        //     if (p.isSmart == 1) {
        //         if (p.isMe) {
        //             this.smartFishCallback();
        //         }
        //     }
        // }
    }

    // public starCheckLock() {
    //     for (let i = 0; i < this.playerMgr.playerCount; i++) {
    //         let p = this.playerMgr.getPlayerBySeat(i);
    //         if (!p) {
    //             continue;
    //         }
    //         if (p.isLock == 1 && p.seat != this.playerMgr.mySeat) {
    //             let lockFish = p.lockFish;
    //             if (lockFish == undefined || !lockFish.liveInCurScene()) {
    //                 continue;
    //             }
    //             this.bulletMgr.changeBulletMove(p.seat);
    //             this.bulletMgr.shoot(p.seat, p.aimCircle.position, 0);
    //         }
    //     }
    // }

    public FoundLockFishs() {
        let fishArr = [];
        // 在普通鱼种找 有没有符合要求的
        for (let i = 0; i < this.fishLayer.children.length; i++) {
            let fishNode = this.fishLayer.children[i];
            let fish = fishNode.getComponent(BYFish);

            if (fish.liveInCurScene()) {
                fishArr.push(fishNode);
            }
        }
        if (fishArr != undefined && fishArr != []) {
            fishArr.sort((a, b) => {
                if (isBoss(b.getComponent(BYFish).typeId)) {
                    return 100;
                } else if (isBoss(a.getComponent(BYFish).typeId)) {
                    return -100;
                } else {
                    return b.getComponent(BYFish).typeId - a.getComponent(BYFish).typeId;
                }
            });

            for (let i = 0; i < fishArr.length; i++) {
                if (this.sendLockFishs == undefined || this.sendLockFishs == [] || this.sendLockFishs.length < 3) {
                    if (this.sendLockFishs == undefined) {
                        this.sendLockFishs = [];
                        this.sendLockFishs.push(fishArr[i]);
                        continue;
                    }
                    let haved = false;
                    for (let j = 0; j < this.sendLockFishs.length; j++) {
                        if (this.sendLockFishs[j] == fishArr[i]) {
                            haved = true;
                        }
                    }
                    if (!haved) {
                        this.sendLockFishs.push(fishArr[i]);
                    }
                }
            }
        }
        // if (this.msg && this.sendLockFishs && this.sendLockFishs != []) {
        //     this.msg.gameBYHandlerrobotFishInfo(this.sendLockFishs);
        // }
    }


    public checkLockFishs() {
        let haveChange = false;
        if (this.sendLockFishs != undefined) {
            for (let i = 0; i < this.sendLockFishs.length; i++) {
                let fishNode = this.sendLockFishs[i];
                if (!fishNode.isValid) {
                    haveChange = true;
                    this.sendLockFishs.splice(i, 1);
                    i--;
                    continue;
                }
                let fish = fishNode.getComponent(BYFish);
                let isCan = fish.liveInCurScene();
                if (!isCan) {
                    haveChange = true;
                    this.sendLockFishs.splice(i, 1);
                    i--;
                }
            }
        }
        if (haveChange || this.sendLockFishs == undefined || this.sendLockFishs == [] || this.sendLockFishs.length === 0) {
            this.FoundLockFishs();
        }
    }



    // 锁定按钮
    private OnClickLockShootBullet() {
        // this.cancelFishSmart();
        // this.byAudio.playButtonClickSound();
        // this.hideChangeGunBtn();
        // if (this.playerMgr.me.isLock) {
        //     this.closeLockFish();
        // } else {
        //     this.openLockFish();
        // }
    }

    public openClickFirstLockFish() {
        this.animationAim.position = cc.v3(0, 0);
        this.animationAim.scale = 15;
        this.animationAim.opacity = 255;
        this.animationAim.active = true;
        // let lockfish1 = this.playerMgr.me.lockFish.node;
        // let tmpPos = this.toWroldPos(cc.v2(lockfish1.position), cc.v2(lockfish1.parent.position));
        // let action = cc.spawn(
        //     cc.moveTo(0.3, tmpPos),
        //     cc.scaleTo(0.3, 1),
        //     cc.rotateBy(0.3, 10),
        // );
        // let callBack = cc.callFunc(this.animationAimHide, this);
        // cc.tween(this.animationAim).then(cc.sequence(action, cc.fadeOut(0.05), callBack)).start();
        // this.clickFirstLockFish = true;
    }

    public animationAimHide() {
        this.animationAim.position = cc.v3(-2000, 0);
    }

    // 打开锁定
    public openLockFish() {
        // this.HLLockIcon.active = true;
        // let me = this.playerMgr.me;
        // if (me) {
        //     me.gunBgRotate(true);
        // }
        // me.isLock = 2;
        // this.fishMgr.ShowOrHideFishButton(true);
        // // this.schedule(this.LockShootCallback, BYGame.STEP_TIME);

        // if (!this.lockNotice.active) {
        //     this.lockNotice.opacity = 0;
        //     this.lockNotice.active = true;
        //     let endFunc = cc.callFunc(() => { this.lockNotice.active = false });
        //     //this.lockNotice.runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(4), cc.fadeOut(1), endFunc));
        //     cc.tween(this.lockNotice).then(cc.sequence(cc.fadeIn(1), cc.delayTime(4), cc.fadeOut(1), endFunc)).start();
        // }

    }

    // // 关闭锁定
    // public closeLockFish() {
    //     let me = this.playerMgr.me;
    //     if (me) {
    //         me.gunBgRotate(false);
    //     }
    //     let mySeat = this.playerMgr.mySeat
    //     this.closeLock(mySeat);
    //     this.HLLockIcon.active = false;   // 关闭 按钮高亮的显示
    //     this.clickFirstLockFish = false;
    //     this.fishMgr.ShowOrHideFishButton(false);  // 鱼上面的点击事件隐藏
    //     // this.unschedule(this.LockShootCallback);
    //     this.msg.gameBYHandlerLock(0);  //通知服务器关闭LOCK状态
    // }

    // // public LockShootCallback() {
    // //     this.lockFish();
    // // }

    public toWroldPos(sonPos: cc.Vec2, parentPos: cc.Vec2) {
        // if (this.playerMgr.isRotate) {
        //     sonPos.x = - sonPos.x;
        //     sonPos.y = - sonPos.y;
        // }
        return cc.v2(sonPos.x + parentPos.x, sonPos.y + parentPos.y);
    }

    // private lockFishCallback() {
    //     if (!this.clickFirstLockFish) {
    //         return;
    //     }
    //     let me = this.playerMgr.me;
    //     if (me.lockFish && me.lockFish.liveInCurScene()) {
    //         let tmpPos = this.toWroldPos(cc.v2(me.lockFish.node.position), cc.v2(me.lockFish.node.parent.position));
    //         this.curTouchPos = tmpPos;
    //         this.bulletMgr.changeBulletMove(this.playerMgr.mySeat);
    //         this.bulletMgr.shoot(this.playerMgr.mySeat, tmpPos);
    //     } else {
    //         if (me.isLock === 1) {
    //             me.lockFish = undefined;
    //             me.isLock = 2;
    //             if (me.isAuto) {
    //                 let deg = getQuadrantDegree(me.gunPos, this.curTouchPos);
    //                 this.msg.gameBYHandlerAutoMatic(1, deg);
    //             }
    //             this.msg.gameBYHandlerLock(2);
    //             this.startFishSmart();
    //         }
    //     }
    // }

    // // 自动按钮
    // public OnClickAutoShootBullet() {
    //     this.cancelFishSmart();
    //     this.hideChangeGunBtn();
    //     this.byAudio.playButtonClickSound();

    //     if (this.playerMgr.me.isAuto) {
    //         this.closeAutoShootBullet();
    //     } else {
    //         this.openAutoShootBullet();
    //     }
    // }

    // public openAutoShootBullet() {
    //     this.playerMgr.me.isAuto = 1;
    //     let deg = getQuadrantDegree(this.playerMgr.me.gunPos, this.curTouchPos);
    //     this.msg.gameBYHandlerAutoMatic(1, deg);
    //     this.HLAutoIcon.active = true;
    //     // this.schedule(this.autoShootCallback, BYGame.STEP_TIME);
    // }
    // public closeAutoShootBullet() {
    //     this.playerMgr.me.isAuto = 0;
    //     this.msg.gameBYHandlerAutoMatic(0);
    //     this.HLAutoIcon.active = false;
    //     // this.unschedule(this.autoShootCallback);
    // }

    // public autoShootCallback() {
    //     if (this.playerMgr.me.isLock != 1) {
    //         this.bulletMgr.shoot(this.playerMgr.mySeat, this.curTouchPos);
    //     }
    // }
    // 自己发子弹 并改变炮台的转向
    public shootBullet() {
        var touchPos = this.curTouchPos;
        this.bulletMgr.shoot(this.playerMgr.mySeat, touchPos);
    }

    // public changeAutoDegAndPost() {
    //     let deg = getQuadrantDegree(this.playerMgr.me.gunPos, this.curTouchPos);
    //     this.msg.gameBYHandlerAutoMatic(1, deg);
    // }

    public showButtleCountMoreTip() {
        // if (!this.tipCanShow) {
        //     return;
        // }

        // this.tipCanShow = false;
        // showTip("亲，屏幕中炮弹太多啦，节约点子弹呗～");

        // this.scheduleOnce(() => {
        //     this.tipCanShow = true;
        // }, 1);
    }

    // public closeLock(location: number) {
    //     let p = this.playerMgr.getPlayerBySeat(location);
    //     p.isLock = 0;
    //     p.lockFishId = -1;
    //     p.lockFishFormationId = -1;
    //     p.lockFish = undefined;
    //     p.aimCircle.active = false;
    //     p.hideLockDotLine();
    // }

    touch2GamePos(v: cc.Vec2) {
        return new cc.Vec2(v.x - this.halfSW, v.y - this.halfSH);
    }

    // // 接收到服务器消息后  改变本地 GUN的 锁定状态
    // public changeGunLockState(seat: number, isLock: number) {
    //     let p = this.playerMgr.getPlayerBySeat(seat);
    //     if (!p) {
    //         return;
    //     }
    //     p.isLock = isLock;
    //     if (isLock === 0) {
    //         this.closeLock(seat);
    //         p.gunBgRotate(false);
    //     } else {
    //         p.gunBgRotate(true);
    //     }
    // }

    // // 接收到服务器消息后  改变本地炮台 锁定的鱼的ID
    // public changeLockFishId(seat: number, fishId: number, fishFormationId: number = -1) {
    //     let p = this.playerMgr.getPlayerBySeat(seat);
    //     if (!p) {
    //         return;
    //     }
    //     p.lockFishId = fishId;
    //     p.lockFishFormationId = fishFormationId;
    //     this.doBulletFollowFish(seat, fishId, fishFormationId);
    // }

    // // 让子弹向锁定的鱼移动
    // public doBulletFollowFish(seat: number, fishId: number, fishFomationId?: number) {
    //     let p = this.playerMgr.getPlayerBySeat(seat);
    //     let currentFish = this.fishMgr.getFishById(fishId, fishFomationId);
    //     if (!currentFish) {
    //         p.lockFish = undefined;
    //         cc.log("doBulletFollowFish  currentFish  undefined");
    //         return;
    //     }
    //     p.lockFish = currentFish.getComponent(BYFish);

    //     this.bulletMgr.changeBulletMove(seat);
    // }

    // public moenyNotEnough() {
    //     if (this.moenyNotLayerIsShow) {
    //         return;
    //     }
    //     this.moenyNotLayerIsShow = true;

    //     let cf = showConfirm("亲，您的金币不足了噢，现在就去补充一点吗？", true, true, "去充值", "去银行")
    //     cf.showClose()
    //     cf.okFunc = () => {
    //         g.curQiutShow = QUITSHOW.SHOWRECHARGE
    //         leave()
    //     }
    //     cf.cancelFunc = () => {
    //         g.curQiutShow = QUITSHOW.SHOWBANK
    //         leave()
    //     }
    //     cf.closeFunc = () => {
    //         this.moenyNotLayerIsShow = false
    //     }
    //     let leave = () => {
    //         this.moenyNotLayerIsShow = false
    //         this.byAudio.playButtonClickSound()
    //         g.lastGame = ""
    //         this.endGame = true
    //         this.requestLeaveGame()
    //     }
    // }

    // public backBtClick() {

    //     this.byAudio.playButtonClickSound();
    //     let confirmnode = showConfirm("亲，确定不再多玩一会儿了吗？", true, true, "确定", "取消");
    //     confirmnode.okFunc = () => {
    //         this.backMainGame();
    //     };
    // }

    // public backMainGame() {
    //     this.endGame = true;
    //     this.requestLeaveGame()
    // }

    // public enmuLayerhide(elayer: cc.Node) {
    //     elayer.active = false;
    // }

    // public enmuBtclick() {

    //     if (this.btn_menu.angle % 180 != 0) {
    //         return;
    //     }

    //     this.hideChangeGunBtn();
    //     this.byAudio.playButtonClickSound();
    //     cc.director.getActionManager().removeAllActionsFromTarget(this.enumLayer, true);

    //     if (this.enumLayer.active) {
    //         let callBack1 = cc.callFunc(this.enmuLayerhide, this.enumLayer);
    //         // cc.tween(this.enumLayer).then(cc.sequence(cc.fadeOut(0.2), callBack1)).start();

    //         this.btn_menu.angle = -180;

    //         cc.tween(this.btn_menu).then(cc.rotateTo(0.2, 0)).start();
    //         cc.tween(this.enumLayer).then(cc.sequence(cc.scaleTo(0.2, 1, 0), callBack1)).start();

    //         // this.btn_menu.runAction(cc.rotateTo(0.2, 0));
    //         // this.enumLayer.runAction(cc.sequence(cc.scaleTo(0.2, 1, 0), callBack1));

    //     } else {
    //         this.enumLayer.active = true;
    //         // this.enumLayer.opacity = 0;
    //         //this.enumLayer.runAction(cc.fadeIn(0.2));
    //         // cc.tween(this.enumLayer).to(0.2, { opacity: 255 }).start();

    //         this.btn_menu.angle = 0;

    //         // this.btn_menu.runAction(cc.rotateTo(0.2, 180));
    //         // this.enumLayer.runAction(cc.scaleTo(0.2, 1, 1));

    //         cc.tween(this.btn_menu).then(cc.rotateTo(0.2, 180)).start();
    //         cc.tween(this.enumLayer).then(cc.scaleTo(0.2, 1, 1)).start();
    //     }
    // }

    // public withdrawBtClick(grade: number) {
    //     this.byAudio.playButtonClickSound();


    //     this.byAudio.playButtonClickSound();
    //     let confirmnode;
    //     if (isFestivalGuns(grade)) {//活动
    //         if (isRebateGunArr(grade)) { //周返利活动
    //             if (WeeklyRebateModel.instance().isGoing === 1) {
    //                 confirmnode = showConfirm("亲，赶快去参加周返利抽奖解锁吧，现在就要离开吗？", true);
    //             } else {
    //                 showTip("活动未开启!");
    //                 return;
    //             }
    //         }
    //     } else {
    //         confirmnode = showConfirm("亲，充值需要离开渔场才能进行噢，现在就要离开吗？", true);
    //     }
    //     confirmnode.okFunc = () => {
    //         g.lastGame = "";
    //         if (isFestivalGuns(grade)) { //活动
    //             if (isRebateGunArr(grade)) {
    //                 g.curQiutShow = QUITSHOW.Rebate;
    //                 g.isRebate = true;
    //             } else {
    //                 g.curQiutShow = QUITSHOW.Festvial;
    //             }
    //             this.backMainGame();
    //         } else {
    //             g.curQiutShow = QUITSHOW.SHOWRECHARGE;
    //             this.backMainGame();
    //         }
    //     };
    // }

    // public exchangeBtClick() {

    //     this.byAudio.playButtonClickSound();
    //     let confirmnode = showConfirm("亲，兑换需要离开渔场才能进行噢，现在就要离开吗？", true, true, "确定", "取消");
    //     confirmnode.okFunc = () => {
    //         g.lastGame = "";
    //         g.curQiutShow = QUITSHOW.SHOWBANK;
    //         this.backMainGame();
    //     };
    // }



    // public onClickChgGun() {
    //     this.byAudio.playButtonClickSound();
    //     if (!this.byGunHandbook) {
    //         let ui = cc.instantiate(this.preGunHandbook);
    //         this.byGunHandbook = ui.getComponent(BYGunHandbook);
    //         // this.byGunHandbook.autoDestroy = false
    //         this.uiLayer.addChild(ui);
    //     } else {
    //         this.byGunHandbook.openAnim();
    //     }
    // }
    // public onClickFishHandbook() {
    //     this.byAudio.playButtonClickSound();
    //     if (!this.byFishHandbook) {
    //         let ui = cc.instantiate(this.preFishHandbook);
    //         this.byFishHandbook = ui.getComponent(by2fishHandbook);
    //         // this.byFishHandbook.autoDestroy = false
    //         this.uiLayer.addChild(ui);
    //     } else {
    //         this.byFishHandbook.openAnim();
    //     }
    // }
    // public onClickHelp() {
    //     // if (!this.gameHelp) {
    //     let ui = cc.instantiate(this.preHelp);
    //     this.gameHelp = ui.getComponent(by2Help);
    //     // this.gameHelp.autoDestroy = false
    //     this.gameHelp.showContent(this.helpDesc);
    //     this.uiLayer.addChild(ui);
    //     this.gameHelp.openAnim(() => {
    //     })
    //     // } else {
    //     //     this.gameHelp.openAnim(() => {
    //     //         this.gameHelp.showContent(this.helpDesc);
    //     //     })
    //     // }
    // }

    // public setBtClick() {
    //     this.byAudio.playButtonClickSound();
    //     let node = cc.instantiate(this.setting);
    //     node.getChildByName("panel").getChildByName("mid").getChildByName("relogin").active = false;
    //     this.uiLayer.addChild(node);
    //     node.active = true;
    //     node.setPosition(0, 0);
    // }
    // // 点击炮台后  弹出或隐藏 还炮按钮
    // public showHuanPaoBt() {
    //     this.byAudio.playButtonClickSound();
    //     let bt = this.playerMgr.me.myHuanPaoBt;
    //     cc.director.getActionManager().removeAllActionsFromTarget(bt, true);
    //     if (bt.active) {

    //         let callBack1 = cc.callFunc(this.enmuLayerhide, bt);
    //         //bt.runAction(cc.sequence(cc.fadeOut(0.2), callBack1));
    //         cc.tween(bt).then(cc.sequence(cc.fadeOut(0.2), callBack1)).start();
    //     } else {
    //         bt.opacity = 0;
    //         bt.active = true;
    //         //bt.runAction(cc.fadeIn(0.2));
    //         cc.tween(bt).to(0.2, { opacity: 255 }).start();
    //     }
    // }
    // public hideChangeGunBtn() {
    //     let bt = this.playerMgr.me.myHuanPaoBt;
    //     if (bt) {
    //         if (!bt.active) {
    //             return;
    //         }
    //         // bt.active = false;
    //         this.byAudio.playButtonClickSound();
    //         cc.director.getActionManager().removeAllActionsFromTarget(bt, true);
    //         let callBack1 = cc.callFunc(this.enmuLayerhide, bt);
    //         //bt.runAction(cc.sequence(cc.fadeOut(0.2), callBack1));
    //         cc.tween(bt).then(cc.sequence(cc.fadeOut(0.2), callBack1)).start();
    //     }
    // }


    // public bgShake() {
    //     cc.Sprite
    //     cc.director.getActionManager().removeAllActionsFromTarget(this.nodeBg, true)
    //     cc.director.getActionManager().removeAllActionsFromTarget(this.uiLayer, true)
    //     cc.director.getActionManager().removeAllActionsFromTarget(this.gunLayer, true)
    //     this.nodeBg.position = cc.v3(0, 0)
    //     this.uiLayer.position = cc.v3(0, 0)
    //     this.gunLayer.position = cc.v3(0, 0)
    //     let t = 0.04
    //     let t2 = 0.08
    //     let action = cc.sequence(
    //         cc.moveBy(t, cc.v2(10, 10)), cc.moveBy(t2, cc.v2(-20, -20)),
    //         cc.moveBy(t, cc.v2(10, 10)), cc.moveBy(t, cc.v2(0, 10)),
    //         cc.moveBy(t2, cc.v2(0, -20)), cc.moveBy(t, cc.v2(0, 10)), cc.moveTo(0, cc.v2(0, 0)));
    //     //this.nodeBg.runAction(action)
    //     cc.tween(this.nodeBg).then(action).start()
    //     //this.uiLayer.runAction(action.clone())
    //     cc.tween(this.uiLayer).then(action.clone()).start();
    //     //this.gunLayer.runAction(action.clone())
    //     cc.tween(this.gunLayer).then(action.clone()).start();
    // }

    getGunRes(type: number) {
        let resprefab = this.resArr[type]
        if (this.gunResNodeArr[type] != undefined) {
            return this.gunResNodeArr[type];
        }
        let node = cc.instantiate(resprefab);
        this.gunResNodeArr[type] = node;
        return node;
    }

    // onDestroy() {
    //     cc.director.getScheduler().unscheduleAllForTarget(this);
    //     cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
    //     super.onDestroy();
    // }

    // /*********** 智慧捕鱼 ***********/
    // public smartList: { type: number, rate: number }[] = [];
    // public attackType: string = "";
    // public isTesu: boolean = false;
    // public bulletNum: number = 0;
    // public speciallist: number[] = [];

    // /**
    //  * 打开只能捕鱼选鱼界面
    //  * @param event
    //  */
    // openFishSmart(event: cc.Event) {
    //     // let fishSmart = cc.instantiate(this.fishSmart);
    //     // this.uiLayer.addChild(fishSmart);
    //     // fishSmart.getComponent(ByFishSmart).openAnim(this);
    // }

    // /**
    //  * 取消只能捕鱼，切换到锁定捕鱼
    //  */
    // cancelFishSmartOpenLock() {
    //     if (this.playerMgr.me.isSmart) {
    //         this.cancelFishSmart();
    //         this.openLockFish();
    //     }
    // }

    // /**
    //  * 取消智能捕鱼
    //  */
    // cancelFishSmart() {
    //     if (this.playerMgr.me.isSmart) {
    //         // this.STLockIcon.active = false;
    //         this.playerMgr.me.isSmart = 0;
    //         this.playerMgr.me.lockFish = undefined;
    //         this.smartList.splice(0);
    //     }
    // }

    // /**
    //  * 开始只能捕鱼
    //  */
    // startFishSmart() {
    //     // this.STLockIcon.active = this.playerMgr.me.isSmart > 0;
    //     if (!this.playerMgr.me.isSmart) {
    //         this.cancelFishSmart();
    //         return;
    //     }

    //     /* 只打特殊鱼 */
    //     if (this.isTesu && !this.attackType) {
    //         this.onlyAttackTesu();
    //         return;
    //     }

    //     // /* 优先攻击+特殊攻,优先打特殊鱼 */
    //     // //1:拿到鱼
    //     // let fish: BYFish = null;
    //     // if (this.isTesu && this.attackType == optionType.youxian) {
    //     //     for (let i = 0; i < this.speciallist.length; i++) {
    //     //         fish = this.fishMgr.getFishByFishType(this.speciallist[i]);
    //     //         if (fish) break;
    //     //     }
    //     // }
    //     // if (!fish) {
    //     //     for (let i = 0; i < this.smartList.length; i++) {
    //     //         fish = this.fishMgr.getFishByFishType(this.smartList[i].type);
    //     //         if (fish) break;
    //     //     }
    //     // }
    //     // if (!fish) return;
    //     // this.fishMgr.ShowOrHideFishButton(true);
    //     // this.fishMgr.setSmartFishTarget(fish);
    // }

    // /**
    //  * 只打特殊鱼
    //  */
    // onlyAttackTesu() {
    //     if (!this.playerMgr.me.isSmart) {
    //         return;
    //     }
    //     let fish: BYFish = null;
    //     for (let i = 0; i < this.speciallist.length; i++) {
    //         fish = this.fishMgr.getFishByFishType(this.speciallist[i]);
    //         if (fish) break;
    //     }
    //     if (!fish) return;
    //     this.fishMgr.ShowOrHideFishButton(true);
    //     this.fishMgr.setSmartFishTarget(fish);
    // }

    // /**
    //  * 只能捕鱼开启是的定时检测
    //  */
    // smartFishCallback() {
    //     return;
    // }

    // onclickSkillBoard() {
    //     if (this.node_skillBorad.active) {
    //         let callBack1 = cc.callFunc(this.enmuLayerhide, this.node_skillBorad);
    //         // this.node_skillBorad.x = 0;
    //         // cc.tween(this.node_skillBorad).then(cc.sequence(cc.moveTo(0.2, -800, 0), callBack1)).start();
    //         this.node_skillBorad.active = false;
    //     } else {
    //         this.node_skillBorad.active = true;
    //         // this.node_skillBorad.x = -800;
    //         // cc.tween(this.node_skillBorad).then(cc.moveTo(0.2, 0, 0)).start();
    //     }
    // }


    // onClickUserSkillCard(event: cc.Button, custom: string) {
    //     if (this.clickInterview < 0.2) {
    //         return;
    //     }
    //     if (!this.skillMenu.btnEnabled) {
    //         return;
    //     }
    //     this.adoMgr.playSkillBoardSound();
    //     let skillId = parseInt(custom);
    //     if (this.skillNum[this.myGunRatio][skillId - 1] <= 0) {
    //         showTip("亲，道具卡数量不足，请先获取道具卡哦～");
    //         return;
    //     }
    //     switch (skillId) {
    //         case SkillType.Multiplying:

    //             this.msg.useSkillCard(skillId, 1);
    //             break;
    //         case SkillType.Boom:
    //             this.showMiaozhun(skillId);
    //             break;
    //         case SkillType.Lightning:
    //             this.msg.useSkillCard(skillId, 1);
    //             break;
    //         case SkillType.Renju:
    //             this.msg.useSkillCard(skillId, 1);
    //             break;
    //         case SkillType.Electromagnetic:
    //             if (this.playerMgr.me.isAuto) {
    //                 this.closeAutoShootBullet();
    //             }
    //             if (this.playerMgr.me.isLock) {
    //                 this.closeLockFish();
    //             }

    //             this.showMiaozhun(skillId);
    //             break;
    //         case SkillType.Frozen:
    //             this.msg.useSkillCard(skillId, 1);
    //             break;
    //         case SkillType.Drill: {

    //             if (this.playerMgr.me.isAuto) {
    //                 this.closeAutoShootBullet();
    //             }
    //             if (this.playerMgr.me.isLock) {
    //                 this.closeLockFish();
    //             }


    //             this.showMiaozhun(skillId);
    //         }
    //             break;
    //     }

    // }

    // showMiaozhun(id: number) {

    //     this.node_miaozhun.active = true;
    //     this.spr_miaozhun.x = 0;
    //     this.spr_miaozhun.y = 0;
    //     this._curSkillMiaozhunID = id;
    // }

    // playMultipleTime(ratio, lastTime, pos: number) {

    //     let location = this.playerMgr.toGameLocation(pos);
    //     if (location != this.playerMgr.mySeat) {
    //         return;
    //     }

    //     this.scheduleOnce(this.stopMultipleTime, lastTime)

    //     this.maxFishTypeRate = ratio;
    //     this.multipleTime = true;
    //     this.fishMgr.ShowOrHideFishMultiple(true);
    //     this.node_particleMutiple.active = true;
    // }

    // stopMultipleTime() {
    //     this.maxFishTypeRate = 0;
    //     this.multipleTime = false;
    //     this.node_particleMutiple.active = false;
    //     this.fishMgr.ShowOrHideFishMultiple(false);
    //     this.unschedule(this.stopMultipleTime);
    // }

    // doubleTimeEclipse: number = 0;

    // onMiaozhunTouchStart(event) {
    //     console.log('touch start')
    // }
    // onMiaozhunTouchEnd(event) {
    //     console.log('this.doubleTimeEclipse = ', this.doubleTimeEclipse)
    //     if (this.doubleTimeEclipse <= 36)//双击间隔  600ms
    //     {
    //         console.log('double');

    //         this.node_miaozhun.active = false;
    //         let skillId = this._curSkillMiaozhunID
    //         let posx = this.spr_miaozhun.x
    //         let posy = this.spr_miaozhun.y

    //         let angle = this.playerMgr.me.gunsp.angle;
    //         switch (skillId) {

    //             case SkillType.Boom:
    //                 this.msg.useBombSkill(2, 1, posx, posy);
    //                 break;
    //             case SkillType.Electromagnetic: {

    //                 this.msg.useSkillCard(skillId, 1);
    //                 this.bulletMgr.shootSpecial(this.playerMgr.mySeat, -2, this.curTouchPos, angle,);

    //             }
    //                 break;
    //             case SkillType.Frozen:

    //                 break;
    //             case SkillType.Drill: {

    //                 this.msg.useSkillCard(skillId, 1);
    //                 this.bulletMgr.shootSpecial(this.playerMgr.mySeat, -1, this.curTouchPos, angle);
    //             }
    //                 break;
    //         }
    //     }
    //     //开始记录时间
    //     this.doubleTimeEclipse = 0;
    //     // this.spr_miaozhun.x = event
    // }
    // onMiaozhunTouchMove(event) {
    //     // console.log('移动 ', event)
    //     // this.doubleTimeEclipse = 0;
    //     this.spr_miaozhun.x = event.touch._point.x - this.node_miaozhun.width / 2;
    //     this.spr_miaozhun.y = event.touch._point.y - this.node_miaozhun.height / 2;
    //     // this.playerMgr.me.gunsp.node.angle =


    //     let me = this.playerMgr.me
    //     if (me.isLock === 1 && me.lockFish != undefined) {
    //         return
    //     }
    //     let touchPos = event.getLocation()
    //     let tmpPos = this.touch2GamePos(touchPos)
    //     this.curTouchPos = tmpPos
    //     me.changeGunRotation(tmpPos);

    // }

    // update(dt) {
    //     this.doubleTimeEclipse++;

    //     this.clickInterview += dt;
    //     if (this.doubleTimeEclipse > 60)//如果自上次单击，1s后仍没有单击，检测为1s  为了防·止溢出
    //     {
    //         this.doubleTimeEclipse = 60;
    //     }
    // }



    setSkillLab(ratio: number) {
        this.myGunRatio = ratio;
        let nums = this.skillNum[ratio];
        for (let i = 0; i < this.lab_skillNum.length; i++) {
            this.lab_skillNum[i].string = nums[i] + '';
        }

        // this.skillMenu.setSkillLab(nums);
    }


    setSkillBoard() {

        let r = cc.sys.localStorage.getItem('by2');
        let nums = JSON.parse(r);

        // cc.sys.localStorage.setItem('', JSON.stringify(data));

        for (let i = 0; i < 7; i++) {
            this.onSetSkillTimeBack(i + 1, 0);
        }
    }


    onSetSkillTimeBack(idx, count) {
        if (count == 0) {
            this.lab_countdown[idx - 1].string = '';
            this.progress_skill[idx - 1].progress = 0;
        } else {
            this.lab_countdown[idx - 1].string = count;
            this.progress_skill[idx - 1].progress = count / this.num_countdown;
        }
    }


}