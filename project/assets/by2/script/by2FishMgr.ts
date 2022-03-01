import BYFish from "./by2Fish";
import BYGame from "./by2Game";
// import BulletMgr from "./by2BulletMgr";
import BYFishRoute from "./by2FishRoute";
import { massive } from "./massive2";
import { isBoss, isSkillFish, isWorldBoss1, isWorldBoss2 } from "./by2Util";

const { ccclass, property } = cc._decorator;
// let Decimal = window.Decimal;

@ccclass
export default class BYFishMgr extends cc.Component {

    @property(cc.Prefab)
    fishsPrefab: cc.Prefab = undefined;

    private fishsObj: cc.Node = undefined;
    public game: BYGame = undefined;
    // private bulletMgr: BulletMgr = undefined;
    public fishDirPool: { [fishType: number]: Array<cc.Node> } = {};
    public currtClickFishTag = 0;
    public fishFormationLayer: cc.Node = undefined;
    private fishDir: {
        [key: string]: cc.Node;
    } = {};

    public fishLayerAction = false; // fishlayer 是否在进行移动
    public cirFormationId = 1;
    public bezierFormationId = 1;

    static mermaidType = 95;   // 美人鱼Type

    static frozenType = 94;   // 冰冻Type
    static toadType = 66;   // 金蟾Type
    static jellyfishType = 0;// 14;   // 水母Type
    static seahorseType = 0;//22;   // 海马Type

    static bombType = 92; // 炸弹Type


    onLoad() {
        let game = cc.find("game");
        this.game = game.getComponent(BYGame);
        // // this.bulletMgr = this.game.bulletMgr;

        this.fishFormationLayer = this.game.dieLayer;

        if (!this.fishsObj) {
            this.fishsObj = cc.instantiate(this.fishsPrefab);
        }

        for (let i = 0; i < this.fishsObj.children.length; i++) {
            let fish = this.fishsObj.children[i];
            let btn = fish.getChildByName("button")
            btn.active = false;
            let button = btn.getComponent(cc.Button);

            let clickEvent = button.clickEvents[0];
            clickEvent.target = this.node;
            clickEvent.component = "by2FishMgr";
            clickEvent.handler = "onClickFishButton";

            let nameStr = fish.name;
            this.fishDir[nameStr] = fish;
        }

        this.initFishPool();
        this.ShowOrHideFishMultiple(false);
        setTimeout(() => {
            this.autoGenerateFish();
        }, 1000);
    }

    autoGenerateFish() {
        this.createFish(12, 0, 1, 11);


        let ids = BYFishRoute.fishName;
        let idarr = [];
        for (let k in ids) {
            idarr.push(k);
        }

        let rount = BYFishRoute.anchor;
        this.schedule(() => {
            let fId = idarr[Math.floor(Math.random() * (idarr.length - 30))];
            let routeId = rount[Math.floor(Math.random() * (rount.length - 1))];
            // this.createFish(fId, routeId.id, 0, fId);
            this.createFish(11, routeId.id, 1, 12);
        }, 1);

        // this.createFishFormation(1, 1, 1)
        this.initFishMass();
    }

    onDestroy() {
        cc.director.getScheduler().unscheduleAllForTarget(this);
        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
    }


    // 显示或隐藏  所有鱼的点击按钮   炮台在锁定状态时  显示      不在时  隐藏
    public ShowOrHideFishButton(isShow: boolean) {

        for (let i = 0; i < this.game.fishLayer.children.length; i++) {
            let fish = this.game.fishLayer.children[i];
            fish.getChildByName("button").active = isShow;
        }

        for (let fishType in this.fishDirPool) {
            let fishArr = this.fishDirPool[fishType];
            for (let key in fishArr) {
                let fish = fishArr[key];
                fish.getChildByName("button").active = isShow;
            }
        }

        for (let key in this.fishDir) {
            let fish = this.fishDir[key];
            fish.getChildByName("button").active = isShow;

        }
    }

    // 点击鱼按钮的响应       让被点击的鱼  成为新的锁定目标  并吧消息发给服务器
    private onClickFishButton(event: cc.Event) {
        // if (this.game.playerMgr.me.isSmart) {
        //     this.game.cancelFishSmartOpenLock();
        // }
        // this.currtClickFishTag = event.target.parent.name;//tag->name
        // let me = this.game.playerMgr.me;
        // let fish = event.target.parent.getComponent(BYFish);
        // if (me.isLock && !fish.isDieing) {
        //     me.lockFish = fish;
        //     if (!this.game.clickFirstLockFish) {
        //         this.game.openClickFirstLockFish();
        //     }
        //     me.isLock = 1;

        //     this.game.msg.gameBYHandlerLock(1, fish.fishId, fish.fishFormationId);
        //     // 让打出去的子弹 变成现在锁定的目标
        //     this.game.bulletMgr.changeBulletMove(me.seat);
        // }
    }

    // 创建 普通鱼  和 鱼阵中的鱼 和 鱼阵 的 对象池
    private initFishPool() {
        for (let key in this.fishDir) {
            let keyNum = parseInt(key);
            let fishMoxin = this.fishDir[key];
            this.fishDirPool[keyNum] = [undefined];
            let fish = cc.instantiate(fishMoxin);

            let ani = fish.getComponent(sp.Skeleton);
            if (ani) {
                // ani.animation = 'walk';
                // ani.loop = true;
                ani.setAnimation(0, "walk", true);
                ani.paused = false;
            } else {

            }

            this.fishDirPool[keyNum].push(fish);
            fish.active = false;
            this.node.addChild(fish, keyNum);
            this.fishDirPool[keyNum].splice(0, 1);
        }
    }

    // 创建一条普通鱼   类型  路线ID   偏移ID  该鱼的ID
    public createFish(fishType: number, rootIdx: number, offsetID: number, fishId: number, startPosNum?: number, firstTime?: number) {
        for (let i = 0; i < BYFishRoute.anchor.length; i++) {
            if (BYFishRoute.anchor[i].id == rootIdx) {
                rootIdx = i;
                break;
            }
        }
        if (rootIdx == undefined) {
            cc.log("rootIdx  is  undifen");
            return;
        }
        let fish = this.createOneFishByFishType(fishType);
        if (fish === undefined) {
            console.log('fishType = ', fishType)
            cc.log("fish =  undefined");
            return;
        }
        let fishNode = fish.node;

        fishNode.name = fishId.toString();//tag->name
        fish.fishFormationId = -1;
        // let idx = BYFishRoute.anchor.length - 1;
        // console.log('lex = ', idx)
        fish.rootIdx = rootIdx;
        fish.typeId = fishType;
        fish.fishId = fishId;
        //初始位置
        fishNode.position = cc.v3(BYFishRoute.anchor[rootIdx].points[0][0] + BYFishRoute.offset[offsetID].x,
            BYFishRoute.anchor[rootIdx].points[0][1] + BYFishRoute.offset[offsetID].y);

        if (fishNode.scaleY < 0) {
            fishNode.scaleY = -fishNode.scaleY;
        }
        //Y轴反转
        if (fishNode.scaleY > 0 && (fishNode.position.x > 0 && !this.game.playerMgr.isRotate) || (fishNode.position.x < 0 && this.game.playerMgr.isRotate)) {
            fishNode.scaleY = -fishNode.scaleY;
        }

        if (fishType == BYFishMgr.seahorseType || fishType == BYFishMgr.jellyfishType || fishType == BYFishMgr.bombType) {
            if (fishNode.scaleY < 0) {
                fishNode.scaleY = -fishNode.scaleY;
            }
            if (this.game.playerMgr.isRotate) {
                fishNode.scaleY = -fishNode.scaleY;
            }
        }

        if (isBoss(fishType)) {
            this.game.byAnimMgr.playBossComing();
        } else if (isWorldBoss1(fishType)) {
            this.game.byAnimMgr.playWorldBoss1Coming();
        } else if (isWorldBoss2(fishType)) {
            this.game.byAnimMgr.playWorldBoss2Coming();
        }



        let point = cc.v2(BYFishRoute.offset[offsetID].x, BYFishRoute.offset[offsetID].y);
        let xstartPosNum = 0;
        let curveTimex = BYFishRoute.anchor[rootIdx].curveTime;
        let xfirstTime = curveTimex;
        if (startPosNum != undefined) {
            xstartPosNum = startPosNum;
            let index11 = xstartPosNum * 2;
            if (BYFishRoute.anchor[rootIdx].points.length > index11) {
                fishNode.position = cc.v3(BYFishRoute.anchor[rootIdx].points[index11][0] + BYFishRoute.offset[offsetID].x,
                    BYFishRoute.anchor[rootIdx].points[index11][1] + BYFishRoute.offset[offsetID].y);
            }
        }
        if (firstTime != undefined) {
            xfirstTime = firstTime;
        }
        fish.move(point, xstartPosNum, xfirstTime);

        let lineCount = BYFishRoute.anchor[rootIdx].points.length / 2 - xstartPosNum;
        if (lineCount < 0) {
            lineCount = 0;
            fishNode.active = false;
        }

        let delayTime = lineCount >= 1 ? ((lineCount - 1) * curveTimex + 2 + xfirstTime) : xfirstTime;
        fish.scheduleOnce(() => {
            fishNode.active = false;
            fish.isDieing = true;
            this.fishBackToPool(fish);
        }, delayTime);

    }


    // 创建一条鱼阵的鱼    鱼类型   在鱼阵中的位置    该鱼阵的ID
    public createFishFormationFish(type: number, points: number[][], formationId: number, pos: cc.Vec2) {

        for (let i = 0; i < points.length; i++) {
            let fish = this.createOneFishByFishType(type);
            if (!fish) {
                cc.log("fish =  undefined, fishType = ", type);
                continue;
            }
            let fishNode = fish.node;
            fish.fishFormationId = formationId;
            fish.fishId = points[i][2];
            fish.typeId = type;
            fish.rootIdx = -1;

            fishNode.position = cc.v3(points[i][0] + pos.x, points[i][1] + pos.y);
            if (fishNode.scaleY < 0) {
                fishNode.scaleY = -fishNode.scaleY;
            }
            if (this.game.playerMgr.isRotate && fishNode.scaleY > 0) {
                fishNode.scaleY = -fishNode.scaleY;
            }
            fishNode.angle = 0;
        }

    }

    // 鱼阵 游完后的回掉
    public fishFormationEnd() {
        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        this.fishLayerAction = false;
        this.node.opacity = 255;
        for (let j = 0; j < this.node.children.length; j++) {
            let child = this.node.children[j];
            if (child.active && !child.getComponent(BYFish).isDieing) {
                child.active = false;
                this.fishBackToPool(child.getComponent(BYFish));
            }
        }
        this.node.position = cc.v3(0, 0);
    }

    // 创建一个鱼阵    鱼阵的类型    鱼阵的ID   在鱼阵数组的Index
    public createFishFormation(formationType: number, formationId: number, index: number) {
        console.log('创建鱼阵')

        if (!this.fishLayerAction) {
            this.fishLayerAction = true;
            this.node.position = cc.v3(0, 0);

            if (this.game.playerMgr.isRotate) {
                cc.tween(this.node).then(cc.moveTo(240, cc.v2(-23000, 0))).start();
            } else {
                cc.tween(this.node).then(cc.moveTo(240, cc.v2(23000, 0))).start();
            }
        }
        if (massive[index]) {
            let lineFishes = massive[index].lineFishes;
            let time = 24;
            let pos = cc.v2(0, 0);
            if (this.game.playerMgr.isRotate) {
                pos = cc.v2(-1000 + this.node.x, 0);
            } else {
                pos = cc.v2(-1000 - this.node.x, 0);
            }
            for (let key in lineFishes) {
                let fish = lineFishes[key];
                let fishType = fish.fishType;
                let points = fish.points;
                let posintsArr = points;
                this.createFishFormationFish(fishType, posintsArr, formationId, pos);
            }
        }

    }

    update() {

        // if (!this.fishLayerAction) {
        //     return;
        // }
        // for (let j = 0; j < this.node.children.length; j++) {
        //     let child = this.node.children[j];
        //     let posx = this.game.toWroldPos(cc.v2(child.position), cc.v2(child.parent.position));
        //     if (((posx.x > 870 && !this.game.playerMgr.isRotate) || (posx.x < -870 && this.game.playerMgr.isRotate))
        //         && child.active && !child.getComponent(BYFish).isDieing) {
        //         child.active = false;
        //         this.fishBackToPool(child.getComponent(BYFish));
        //     }
        // }
    }

    public fishBackToPool(byFish: BYFish) {
        let fishType = byFish.typeId;
        byFish.chgSpineState(false);
        this.fishDirPool[fishType].push(byFish.node);
    }
    public createCircleFishFormation2(type: number, formationType: number, formationId: number, fishId?: number,
        aliveFishs?: number[], liveTime?: number) {
        let startP = cc.v2(0, 0);
        let fishArr = [];
        let fishCount = 18;

        if (formationType == 2) {
            fishCount = 5;
        }
        for (let i = 0; i < fishCount; i++) {
            let fish = this.createOneFishByFishType(type);
            if (fish == undefined) {
                cc.log("fish =  undefined, fishType =", type);
                continue;
            }
            let fishNode = fish.node;
            fishNode.position = cc.v3(startP);
            fish.lastPos = cc.v2(0, 0);
            fish.rootIdx = 0;
            fish.typeId = type;
            fish.fishFormationId = formationId;
            fishArr.push(fishNode);
        }

        if (fishArr != []) {
            if (formationType == 1) {
                let angle = 0;
                for (let i = 0; i < fishArr.length; i++) {
                    let fish = fishArr[i];
                    let x = 620 * Math.cos(angle * Math.PI / 180);
                    let y = 620 * Math.sin(angle * Math.PI / 180);
                    fish.angle = angle;
                    if (fish.scaleY < 0) {
                        fish.scaleY = -fish.scaleY;
                    }
                    if (angle > 90 && angle <= 270 && fish.scaleY > 0) {
                        fish.scaleY = -fish.scaleY;
                    }
                    if (this.game.playerMgr.isRotate) {
                        fish.scaleY = -fish.scaleY;
                    }
                    angle = angle + 20;
                    let callback = cc.callFunc(this.fishHide, this, fish);
                    //fish.runAction(cc.sequence(cc.moveTo(17, cc.v2(x, y)), callback));
                    cc.tween(fish).then(cc.sequence(cc.moveTo(17, cc.v2(x, y)), callback)).start();
                    let script = fish.getComponent(BYFish);
                    script.fishId = this.cirFormationId;
                    if (fishId) {
                        script.fishId = fishId;
                        fishId++
                    }
                    this.cirFormationId++
                }
            } else if (formationType == 2) {
                for (let i = 0; i < fishArr.length; i++) {
                    let route = BYFishRoute.fiveBzeirArr[i];
                    let fish = fishArr[i];
                    let bezier = [route[1], route[3], route[2]];
                    let bezierTo = cc.bezierTo(10, bezier);

                    fish.position = route[0];
                    fish.getComponent(BYFish).rootIdx = 1;
                    fish.getComponent(BYFish).lastPos = cc.v2(0, 0);
                    let callback = cc.callFunc(this.fishHide, this, fish);
                    //fish.runAction(cc.sequence(bezierTo, callback));
                    cc.tween(fish).then(cc.sequence(bezierTo, callback)).start();
                    if (fish.scaleY < 0) {
                        fish.scaleY = -fish.scaleY;
                    }

                    let script = fish.getComponent(BYFish);
                    script.fishId = this.bezierFormationId;
                    if (fishId) {
                        script.fishId = fishId;
                        fishId++
                    }
                    this.bezierFormationId++
                }
            }
        }
    }




    // 创建鱼阵  一种鱼  沿一条路线一直刷
    public async createOneRootFormation(rootIdx: number, intervalTime: number, intervalCount: number, fishType: number, fromationId: number, startTime?: number, xfishId?: number, idx?: number) {
        let count = intervalCount - 1;
        let fishId = 1;
        if (xfishId) {
            fishId = xfishId + 1;
        }
        let zRootId = rootIdx;
        let xfromationId = fromationId;
        for (let i = 0; i < BYFishRoute.anchor.length; i++) {
            if (BYFishRoute.anchor[i].id == rootIdx) {
                rootIdx = i;
                break;
            }
        }

        if (startTime && startTime > 0) {
            await new Promise(resolve => {
                this.scheduleOnce(() => { resolve(true) }, startTime);
            });;
        }

        this.schedule(() => {
            if (rootIdx == undefined) {
                cc.log("rootIdx  is  undifen");
                return;
            }
            let fish = this.createOneFishByFishType(fishType);
            if (fish == undefined) {
                cc.log("fish =  undefined , fishType =   ", fishType);
                return;
            }
            let fishNode = fish.node;
            fishNode.name = fishType.toString()//tag->name
            fishNode.position = cc.v3(BYFishRoute.anchor[rootIdx].points[0][0],
                BYFishRoute.anchor[rootIdx].points[0][1]);
            if (fishNode.scaleY < 0) {
                fishNode.scaleY = -fishNode.scaleY;
            }
            if (fishNode.scaleY > 0 && (fishNode.position.x > 0 && !this.game.playerMgr.isRotate) || (fishNode.position.x < 0 && this.game.playerMgr.isRotate)) {
                fishNode.scaleY = -fishNode.scaleY;
            }
            fish.rootIdx = rootIdx;


            // console.log('--------------- fishId = ', fishId)
            // console.log('zRootId = ', zRootId)
            // if (idx) {
            //     fish.fishId = new Decimal(idx).add(1).mul(100).add(fishId).toNumber();
            // } else {

            //     fish.fishId = new Decimal(zRootId).sub(100).mul(100).add(fishId).toNumber();
            // }
            fish.fishId = fishId;

            // console.log(' fish.fishId = ', fish.fishId)

            fish.typeId = fishType;
            fish.fishFormationId = xfromationId;

            let xstartPosNum = 0;
            let curveTimex = BYFishRoute.anchor[rootIdx].curveTime;
            let xfirstTime = curveTimex;

            fish.move(cc.v2(0, 0), xstartPosNum, xfirstTime);

            let lineCount = BYFishRoute.anchor[rootIdx].points.length / 2 - xstartPosNum;
            if (lineCount < 0) {
                console.log('---------------------linecount<0');
                lineCount = 0;
                fishNode.active = false;
            }
            fish.scheduleOnce(() => {
                fishNode.active = false;
                fish.isDieing = true;
                this.fishBackToPool(fish);
            }, lineCount * curveTimex + 2);

            fishId++;
        }, intervalTime, count)
    }

    // 创建鱼
    public createOneFishByFishType(fishType: number) {
        if (this.fishDirPool[fishType]) {
            let haveFish = false;
            let fishNode = undefined;
            for (let j = 1; j < this.fishDirPool[fishType].length; j++) {
                let xfish = this.fishDirPool[fishType][j];
                if (xfish != null && xfish != undefined && !xfish.active) {
                    fishNode = xfish;
                    haveFish = true;
                    this.fishDirPool[fishType].splice(j, 1);
                    break;
                }
            }
            if (!haveFish) {
                let xfish = cc.instantiate(this.fishDir["" + fishType]);
                fishNode = xfish;
                this.node.addChild(fishNode, fishType);
            }

            fishNode.active = true;

            let fish: BYFish = fishNode.getComponent(BYFish);
            cc.director.getActionManager().removeAllActionsFromTarget(fishNode, true);
            cc.director.getScheduler().unscheduleAllForTarget(fish);
            fish.chgColliderState(true);
            fish.fishId = fishType;
            fish.multiple.active = false;
            fish.isDieing = false;
            fish.chgIceState(false);
            fish.runBgAnimation();
            fish.chgSpineState(true);
            fish.enabled = true;
            // fish.node.setPosition(110, 0);
            return fish;
        } else {
            return undefined;
        }
    }




    // 鱼死亡后 的回调
    public fishHide(fish: cc.Node) {

        fish.active = false;
        cc.director.getActionManager().removeAllActionsFromTarget(fish, true);
        cc.director.getScheduler().unscheduleAllForTarget(fish.getComponent(BYFish));

        fish.angle = 0;
        fish.getComponent(BYFish).isDieing = true;

        if (fish.parent == this.game.dieLayer) {
            fish.parent = this.game.fishLayer;
        }

        this.fishBackToPool(fish.getComponent(BYFish));
    }

    public showCoin(self: BYFishMgr, fish: BYFish) {

        let coin = fish.coin;
        let extraCoin = fish.extraCoin;
        // if (isBoss(fish.typeId) && fish.dieByLoactionGun == this.game.playerMgr.mySeat) {
        //     this.game.byAnimMgr.showMakeMoneyAnimation(coin);
        //     return;
        // }
        let fishType = fish.typeId;
        let tmpPos = this.game.toWroldPos(cc.v2(fish.node.position), cc.v2(fish.node.parent.position));
        this.game.byAnimMgr.playCoinAnim(tmpPos, fish.dieByLoactionGun, coin, fishType, extraCoin);
    }

    // 根据鱼ID 通知一个普通鱼的死亡    鱼ID      得到的钱    服务器中谁杀死的     鱼阵ID
    public fishDieByFishId(fishId: number, gainMoney: string, pos: number, massId?: number, fishNode: cc.Node = undefined, extraMoney?: string) {

        if (this.game.playerMgr.toGameLocation(pos) == this.game.playerMgr.mySeat && parseFloat(gainMoney) > 0) {
            // this.game.bgShake();
        }

        if (!fishNode) {
            fishNode = this.getFishById(fishId, massId);
        }
        let fish: BYFish = undefined;
        if (!fishNode) {
            cc.log("-----死亡鱼未找到---fishID-" + fishId + "---massID--" + massId);
            return;
        }
        fish = fishNode.getComponent(BYFish);
        if (massId && massId != -1) {
            if (this.fishLayerAction) {
                let tmpPos = this.game.toWroldPos(cc.v2(fishNode.position), cc.v2(fishNode.parent.position));
                if (this.game.playerMgr.isRotate) {
                    tmpPos.x = -tmpPos.x;
                    tmpPos.y = -tmpPos.y;
                }
                fishNode.parent = this.game.dieLayer;
                fishNode.position = cc.v3(tmpPos);
            }
        }

        fish.dealDie();
        fish.coin = gainMoney;
        fish.extraCoin = extraMoney;
        fish.dieByLoactionGun = this.game.playerMgr.toGameLocation(pos);

        // this.game.playerMgr.playerArr.forEach(el => {
        //     if (el && fish === el.lockFish) {
        //         el.lockFish = undefined;
        //     }
        // });

        this.game.byAnimMgr.delFishDie(fishNode, pos, fish.typeId, gainMoney);
        // this.game.byAudio.delFishDie(fish.typeId);

        let time = 0.1;
        let rot = 80;
        let callback = cc.callFunc(this.fishHide, this, fishNode);
        let callback1 = cc.callFunc(this.showCoin, this, fish);
        let action = cc.sequence(cc.rotateBy(time / 2, rot / 2), cc.rotateBy(time, -rot), callback1,
            cc.rotateBy(time, rot), cc.rotateBy(time, -rot),
            cc.rotateBy(time, rot), cc.rotateBy(time, -rot),
            cc.rotateBy(time, rot), cc.rotateBy(time, -rot),
            cc.rotateBy(time, rot), cc.rotateBy(time, -rot),
            cc.rotateBy(time, rot), cc.rotateBy(time, -rot), callback);
        let ani = fishNode.getComponent(sp.Skeleton);

        cc.tween(fishNode).then(action).start();
        // }

        fish.scheduleOnce(() => {
            if (fishNode.active) {
                this.fishHide(fishNode);
            }
        }, 1.3);

        if (this.game.playerMgr.toGameLocation(pos) == this.game.playerMgr.mySeat && fish.typeId
            && fish.typeId > 80) {
            let skillId = fish.typeId - 81;
            console.log('skillId == ', skillId)

            this.game.skillNum[this.game.myGunRatio][skillId]++;
            this.game.lab_skillNum[skillId].string = this.game.skillNum[this.game.myGunRatio][skillId].toString();
        }

    }

    // 鱼潮 来之前   普通鱼游走
    public normalFishLeaveByTime(time: number) {
        for (let i = 0; i < this.game.fishLayer.children.length; i++) {
            let fishNode = this.game.fishLayer.children[i];
            let fish = fishNode.getComponent(BYFish);
            if (fishNode.active && !fish.isDieing) {
                fish.leaveCurrtSceen(time);
                fish.isDieing = true;
                this.fishBackToPool(fish);
            }
        }
        this.game.byAnimMgr.playWaveAim();
    }
    // 鱼潮 来之前   普通鱼游走
    public normalFishLeave2ByTime(time: number) {
        for (let i = 0; i < this.game.fishLayer.children.length; i++) {
            let fishNode = this.game.fishLayer.children[i];
            let fish = fishNode.getComponent(BYFish);
            if (fishNode.active && !fish.isDieing) {
                fish.leaveCurrtSceen(time);
                fish.isDieing = true;
                this.fishBackToPool(fish);
            }
        }
    }

    initFishMass() {
        let index1 = 15;
        // let index1 = 20;
        let fishMass = massive[index1];
        cc.log("---fishMass----", fishMass);
        if (fishMass.group == 1) {
            this.createFishFormation(fishMass.type, fishMass.type, index1);
        } else if (fishMass.group == 3 || fishMass.group == 4) {//index1=16,17
            let fishArr = fishMass.midIntervalFishes;
            let arr = fishArr.fishTypes;
            let totalTime = arr.length * fishArr.intervalTime;

            this.cirFormationId = 1;
            let cishu = arr.length;
            let rand = arr.length - cishu;

            if (fishMass.group == 3) {
                let yuanType = 1;
                let fishId = rand * 24 + 1;
                this.game.schedule(() => {
                    let tyep = arr[rand];
                    this.createCircleFishFormation2(tyep, yuanType, tyep, fishId);
                    rand++;
                    fishId = fishId + 24;
                    if (rand > arr.length) {
                        rand = 0;
                    }
                }, fishArr.intervalTime, cishu - 1);
            }


            if (fishMass.group == 4) {
                let yuanType = 2;
                if (cishu > 0) {
                    this.game.schedule(() => {
                        let tyep = arr[rand];
                        this.createCircleFishFormation2(tyep, yuanType, tyep);
                        rand++;
                        if (rand > arr.length) {
                            rand = 0;
                        }
                    }, fishArr.intervalTime, cishu - 1);
                }
            }
        } else if (fishMass.group == 2) {
            let fishArrs = fishMass.routeIntervalFishes;
            for (let i = 0; i < fishArrs.length; i++) {
                let arr = fishArrs[i];
                let count = arr.intervalCount;
                let fishId = arr.intervalCount - count;
                this.createOneRootFormation(arr.routeId, arr.intervalTime, count, arr.fishType, fishId, arr.startTime, fishId, i);
            }
        }

    }


    getFishById(fishId: number, fishFomationId: number = -1) {
        let currentFish = undefined;
        fishFomationId = fishFomationId === undefined ? - 1 : fishFomationId
        for (let i = 0; i < this.node.children.length; i++) {
            let fishNode = this.node.children[i];
            let fish = fishNode.getComponent(BYFish);
            if (fishNode.active && fish.fishId === fishId && fish.fishFormationId === fishFomationId) {
                currentFish = fishNode;
                break;
            }
        }
        return currentFish;
    }

    /*********** 智慧捕鱼 ***********/
    /**
     * 根据fishType获取BYFish
     * @param fishType
     */
    getFishByFishType(fishType: number): BYFish {
        for (let i = 0; i < this.game.fishLayer.children.length; i++) {
            let fish = this.game.fishLayer.children[i];
            let byFish = fish.getComponent(BYFish);
            if (byFish && byFish.typeId == fishType) {
                if (fish.active && !byFish.isDieing && byFish.liveInCurScene()) {
                    return byFish;
                }
            }
        }
        return null;
    }

    /**
     * 绑定智慧捕鱼的鱼
     * @param byFish
     */
    setSmartFishTarget(byFish: BYFish) {
        // let me = this.game.playerMgr.me;
        // let fish = byFish;
        // if (me.isSmart && !fish.isDieing) {
        //     me.lockFish = fish;
        //     if (!this.game.clickFirstLockFish) {
        //         this.game.openClickFirstLockFish();
        //     }
        //     this.game.msg.gameBYHandlerLock(1, fish.fishId, fish.fishFormationId);
        //     // 让打出去的子弹 变成现在锁定的目标
        //     this.game.bulletMgr.changeBulletMove(me.seat);
        // }
    }

    // 显示或隐藏  所有鱼的加倍
    public ShowOrHideFishMultiple(isShow: boolean) {

        for (let i = 0; i < this.game.fishLayer.children.length; i++) {
            let fish = this.game.fishLayer.children[i];
            let multiple = fish.getChildByName("multiple")
            if (multiple)
                multiple.active = isShow;
        }

        for (let fishType in this.fishDirPool) {
            let fishArr = this.fishDirPool[fishType];
            for (let key in fishArr) {
                let fish = fishArr[key];
                let multiple = fish.getChildByName("multiple")
                if (multiple)
                    multiple.active = isShow;
            }
        }

        for (let key in this.fishDir) {
            let fish = this.fishDir[key];
            let multiple = fish.getChildByName("multiple")
            if (multiple)
                multiple.active = isShow;

        }
        // multiple.active = isShow;
    }
}