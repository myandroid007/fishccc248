
import BYBullet from "./by2Bullet";
import BYGame from "./by2Game";
import BYFishRoute from "./by2FishRoute";
import { getQuadrantDegree, getFishKindType, isBoss } from "./by2Util"
import BYFishMgr from "./by2FishMgr";
import RedShader from "./redShader2";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BYFish extends cc.Component {
    @property([sp.Skeleton])
    mySpine: sp.Skeleton[] = [];

    public lastPos: cc.Vec2 = undefined;
    public rootIdx = -1;
    public typeId: number = undefined;
    public id: number = undefined;

    public game: BYGame = undefined;
    // public byMsg: BYMsg;

    public fishId: number = undefined;
    public fishFormationId: number = -1;
    public fishNetPos: cc.Vec2 = undefined;
    public coin: string = undefined;

    public extraCoin: string = undefined;
    public dieByLoactionGun: number = undefined;

    public isDieing: boolean = false;
    public bulletId: number = 0;     // 打中 这条鱼的 子弹ID
    public bulletPos: cc.Vec2 = undefined; // 子弹打中鱼时的 子弹的位置

    private collider: cc.Collider = undefined;

    // private shader: any = undefined;

    public ice: cc.Node = undefined;


    public multiple: cc.Node = undefined;
    private shader: RedShader = undefined;

    onLoad() {
        let game = cc.find("game");;
        this.game = game.getComponent(BYGame);
        this.initColliderAndShader();
    }

    update() {
        if (this.rootIdx != -1) {
            this.updateRotation();
        }
    }

    initColliderAndShader() {
        this.collider = this.node.getComponent(cc.CircleCollider);
        if (!this.collider) {
            this.collider = this.node.getComponent(cc.BoxCollider);
        }
        this.shader = this.node.getComponent("redShader2");
        this.ice = this.node.getChildByName("ice");
        this.multiple = this.node.getChildByName("multiple");
    }

    chgColliderState(state: boolean) {
        this.collider.enabled = state;
    }
    chgIceState(state: boolean) {
        this.ice.opacity = 220;
        this.ice.active = state;
    }

    chgMultipleState(state: boolean) {
        if (this.multiple) {
            this.multiple.opacity = 0;
            this.multiple.active = state;
        }
    }

    chgSpineState(state: boolean) {
        this.mySpine.forEach(el => {
            el.paused = !state;
        });
    }
    public move(offset: cc.Vec2, startPosNum: number, firstTime: number) {
        //记录第一个坐标

        this.lastPos = cc.v2(BYFishRoute.anchor[this.rootIdx].points[0][0] + offset.x, BYFishRoute.anchor[this.rootIdx].points[0][1] + offset.y);

        let lineCount = BYFishRoute.anchor[this.rootIdx].points.length / 2;
        let actionArr: cc.FiniteTimeAction[] = [];

        for (let i = startPosNum; i < lineCount; i++) {
            let c1 = cc.v2(BYFishRoute.control[this.rootIdx].points[i * 2][0] + offset.x, BYFishRoute.control[this.rootIdx].points[i * 2][1] + offset.y);
            let c2 = cc.v2(BYFishRoute.control[this.rootIdx].points[i * 2 + 1][0] + offset.x, BYFishRoute.control[this.rootIdx].points[i * 2 + 1][1] + offset.y);
            let a2 = cc.v2(BYFishRoute.anchor[this.rootIdx].points[(i + 1) * 2 - 1][0] + offset.x, BYFishRoute.anchor[this.rootIdx].points[(i + 1) * 2 - 1][1] + offset.y);
            let bezier = [c1, c2, a2];
            let bezierTo = cc.bezierTo(BYFishRoute.anchor[this.rootIdx].curveTime, bezier);
            if (firstTime != undefined && i == startPosNum) {
                bezierTo = cc.bezierTo(firstTime, bezier);
            }
            actionArr.push(bezierTo);
        }

        if (actionArr != []) {
            if (actionArr.length == 1) {
                cc.tween(this.node).then(actionArr[0]).start();
            } else if (actionArr.length > 1) {
                cc.tween(this.node).then(cc.sequence(actionArr)).start();
            }
        }
    }

    private updateRotation() {
        if ((this.typeId == BYFishMgr.jellyfishType) || this.typeId == BYFishMgr.seahorseType || this.typeId == BYFishMgr.bombType) {
            // this.node.angle = 0;
            return;
        }
        let curPoint: cc.Vec2 = cc.v2(this.node.position);//获取鱼当前坐标
        if (this.lastPos == undefined) {
            return;
        }
        if (curPoint.x == this.lastPos.x || curPoint.y == this.lastPos.y) {
            return;
        }

        let deg: number = getQuadrantDegree(this.lastPos, curPoint);

        this.node.angle = -deg;

        this.lastPos = curPoint;  //保存当前的坐标给下一轮刷新使用
    }

    runBgAnimation() {
        let fishType = this.fishId;
        // if (getFishKindType(fishType) == 25 && getFishKindType(fishType) == 26) {
        //     this.groupFishBgRotation();
        // } else if (fishType === BYFishMgr.mermaidType) {
        //     this.node.getComponent(cc.Animation).play();
        // } else if (fishType === BYFishMgr.toadType) {
        //     cc.tween(this.node.getChildByName("bg")).then(cc.rotateBy(2, 360).repeatForever()).start();
        // }

    }

    groupFishBgRotation() {
        let fish = this.node;
        let action1 = cc.rotateBy(2, 360).repeatForever();
        let action2 = cc.rotateBy(4, 360).repeatForever();
        let bg = fish.getChildByName("bg");
        let bgs = fish.getChildByName("bg1");
        cc.tween(bg).then(action1).start();
        for (let i = 0; i < bgs.children.length; i++) {
            let bg1 = bgs.children[i];
            let action3 = action2.clone();
            cc.tween(bg1).then(action3).start();
        }
    }

    shaderSetDefault() {
        // this.shader.setDefault();
        this.shader.setRedShaders(1, this.mySpine);
    }

    // 被击中后变红
    hitRedden() {
        this.shader.setRedShaders(0, this.mySpine);
        this.game.scheduleOnce(() => {
            this.shader.setRedShaders(1, this.mySpine);
        }, 0.1);
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 0) {
            let gunId = other.node.getComponent(BYBullet).gunId;
            let p = this.game.playerMgr.getPlayerBySeat(gunId);
            if (p.isLock === 1 && p.lockFish && this != p.lockFish && p.lockFish.liveInCurScene()) {
                return;
            }
            this.hitRedden();
        }
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag === 0) {
            let gunId = other.node.getComponent(BYBullet).gunId;
            let p = this.game.playerMgr.getPlayerBySeat(gunId);
            if (p.isLock === 1 && this != p.lockFish) {
                if (!p.lockFish || !p.lockFish.liveInCurScene()) {
                    this.hitRedden();
                }
                return;
            }
            //变红
            this.hitRedden();
            this.fishDieByFishId();
        }
    }

    leaveCurrtSceen(time: number) {
        let rotation = this.node.angle;


        let cy = Math.sin(rotation * 2 * Math.PI / 360);
        let cx = Math.cos(rotation * 2 * Math.PI / 360);

        let myX = this.node.x + this.node.parent.x;
        let myY = this.node.y + this.node.parent.y;


        let endPoint = cc.v2(0, 0);


        let endX = 0;
        let endY = 0;
        let off = 100;
        if (cx <= 0 && cy <= 0) {
            // 朝向 第四象限
            endX = -(this.game.halfSW + off);
            endY = -(this.game.halfSH + off);
        } else if (cx <= 0 && cy >= 0) {
            // 第二象限
            endX = -(this.game.halfSW + off);
            endY = (this.game.halfSH + off);
        } else if (cx >= 0 && cy >= 0) {
            // 第一象限
            endX = (this.game.halfSW + off);
            endY = (this.game.halfSH + off);
        } else if (cx >= 0 && cy <= 0) {
            // 第三象限
            endX = (this.game.halfSW + off);
            endY = -(this.game.halfSH + off);
        }

        endPoint.x = endX;
        endPoint.y = endY;

        let jx = endX - myX;
        let jy = endY - myY;

        let juli = Math.sqrt(jx * jx + jy * jy);

        let randomJudu = Math.random() * Math.PI;


        let Mdian1 = cc.v2(cx * 100 + myX, cy * 100 + myY);

        let Mdian2 = cc.v2(juli / 2 * Math.cos(randomJudu) + endX, juli / 2 * Math.sin(randomJudu) + endY);

        let callback = cc.callFunc(this.fishHide, this);


        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        cc.director.getScheduler().unscheduleAllForTarget(this.node.getComponent(BYFish));

        let beizier = [Mdian1, Mdian2, endPoint];
        cc.tween(this.node).then(cc.sequence(cc.bezierTo(2, beizier), callback)).start();
    }

    fishHide() {
        this.node.active = false;
        this.game.fishMgr.fishBackToPool(this);
    }

    liveInCurScene() {
        if (!this.node.isValid || !this.node.active) {
            return false;
        }
        let isdie = this.isDieing;
        let w = this.game.halfSW + 10;
        let h = this.game.halfSH + 10;
        let fish = this.node;
        let tmpPos;
        if (fish.parent != undefined) {
            tmpPos = this.game.toWroldPos(cc.v2(fish.x, fish.y), cc.v2(fish.parent.x, fish.parent.y));
        } else {
            tmpPos = fish.position;
        }
        if (!isdie && fish.active && tmpPos.x > -w && tmpPos.x < w &&
            tmpPos.y < h && tmpPos.y > -h) {
            return true;
        } else {
            return false;
        }
    }

    dealDie() {
        this.isDieing = true;
        this.chgColliderState(false);
        this.chgSpineState(false);
        this.shaderSetDefault();
        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

    onDestroy() {
        cc.director.getScheduler().unscheduleAllForTarget(this);
        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
    }

    //击中死亡
    public fishDieByFishId() {
        let pos = 0;
        let fish: BYFish = this;
        let fishNode = this.node;

        fish.dealDie();
        fish.dieByLoactionGun = this.game.playerMgr.toGameLocation(pos);

        this.game.playerMgr.playerArr.forEach(el => {
            if (el && fish === el.lockFish) {
                el.lockFish = undefined;
            }
        });

        // this.game.byAnimMgr.delFishDie(fishNode, pos, fish.typeId, gainMoney);

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

        fish.scheduleOnce(() => {
            if (fishNode.active) {
                this.fishHide();
            }
        }, 1.3);

        if (this.game.playerMgr.toGameLocation(pos) == this.game.playerMgr.mySeat && fish.typeId
            && fish.typeId > 80) {
            let skillId = fish.typeId - 81;

            this.game.skillNum[this.game.myGunRatio][skillId]++;
            this.game.lab_skillNum[skillId].string = this.game.skillNum[this.game.myGunRatio][skillId].toString();
        }

    }

    public showCoin(self: BYFishMgr, fish: BYFish) {
        let coin = fish.coin;
        let extraCoin = fish.extraCoin;
        if (isBoss(fish.typeId) && fish.dieByLoactionGun == this.game.playerMgr.mySeat) {
            this.game.byAnimMgr.showMakeMoneyAnimation(coin);
            return;
        }
        let fishType = fish.typeId;
        let tmpPos = this.game.toWroldPos(cc.v2(fish.node.position), cc.v2(fish.node.parent.position));
        this.game.byAnimMgr.playCoinAnim(tmpPos, fish.dieByLoactionGun, coin, fishType, extraCoin);
    }

}
