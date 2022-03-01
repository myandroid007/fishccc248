
import BYGame from "./by2Game";
import BYFish from "./by2Fish";
import { getQuadrantDegree, deg2Rad } from "./by2Util"
const { ccclass, property } = cc._decorator;

@ccclass
export default class BYBullet extends cc.Component {
    public gunId: number = undefined;//属于哪个炮台
    public id: number = undefined;//子弹编号

    private speed = 15;
    private speedX = 0;
    private speedY = 0;
    public game: BYGame = undefined;
    public bulletId: number = 0;

    public arr_hitedFish: number[] = [];


    onLoad() {
        let game = cc.find("game");
        this.game = game.getComponent(BYGame);
    }

    //开始移动
    public startMove(spawnV: cc.Vec2, aimV: cc.Vec2) {
        let deg = getQuadrantDegree(spawnV, aimV);
        this.node.angle = -deg - 90;
        //计算初始速度
        let rad = deg2Rad(deg);
        this.speedX = Math.cos(rad) * this.speed;
        this.speedY = Math.sin(rad) * this.speed;
        let absSpx = Math.abs(this.speedX);
        let absSpy = Math.abs(this.speedY);

        if (aimV.x > spawnV.x) {
            this.speedX = absSpx;
        } else {
            this.speedX = -absSpx;
        }
        if (aimV.y > spawnV.y) {
            this.speedY = absSpy;
        } else {
            this.speedY = -absSpy;
        }
    }

    update() {
        this.move();
    }
    private move() {
        if (this.bulletId == -2) {
            return;
        }

        let curX = this.node.x;
        let curY = this.node.y;

        if (curX + this.speedX < -this.game.halfSW || curX + this.speedX > this.game.halfSW) {
            this.node.position.x = -this.game.halfSW
            this.speedX = -this.speedX;
            //console.log("角度变化");
            this.node.angle = -this.node.angle;
        } else if (curY + this.speedY > this.game.halfSH || curY + this.speedY < -this.game.halfSH) {
            this.node.position.y = this.game.halfSH
            this.speedY = -this.speedY;
            this.node.angle = -(180 + this.node.angle) % 360;
        } else {
            this.node.x = (curX + this.speedX);
            this.node.y = (curY + this.speedY);
        }
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag < 1) {
            return;
        }

        // let gunId = this.gunId;
        // let p = this.game.playerMgr.getPlayerBySeat(gunId);
        // let fish = other.node.getComponent(BYFish);
        // if (this.bulletId > 0) {
        //     if (p.isLock === 1 && fish != p.lockFish) {
        //         return;
        //     }
        //     this.hitedFishAndHide(fish, gunId);
        // }

        // if (this.bulletId == -2) {
        //     this.hitedFish(fish, gunId);
        // }
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag >= 1) {
            let gunId = this.gunId;
            let fish = other.node.getComponent(BYFish);
            let p = this.game.playerMgr.getPlayerBySeat(gunId);
            if (this.bulletId < 0) {
                this.hitedFish(fish, gunId);
                return;
            }

            // 如果 在锁定状态下  并且锁定的鱼不存在  该碰撞的子弹消失
            if (p.isLock == 1 && (!p.lockFish || (p.lockFish && !p.lockFish.liveInCurScene()))) {
                this.hitedFishAndHide(fish, gunId);
                return;
            }
            // 在锁定状态下 打中的鱼跟锁定的鱼不一致
            if (p.isLock == 1 && p.lockFish != fish) {
                return;
            }
            this.hitedFishAndHide(fish, gunId);
        }
    }

    hitedFishAndHide(fish: BYFish, seat: number) {
        if (!this.node.active) {
            return;
        }
        // this.game.byAudio.playHitSound(0);
        this.node.active = false;
        let p = this.game.playerMgr.getPlayerBySeat(seat);
        p.bulletCount--;
        if (p.isMe) {
            let event = new cc.Event.EventCustom("collideFish", true);
            event.detail = { bullet: this.node, fishScript: fish };
            this.node.dispatchEvent(event);
        } else {
            let fishpos = this.game.toWroldPos(cc.v2(fish.node.position), cc.v2(fish.node.parent.position));
            let pos = cc.v2((fishpos.x - this.node.position.x) * 1 / 4 + this.node.position.x,
                (fishpos.y - this.node.position.y) * 1 / 4 + this.node.position.y);
            this.game.fishnetMgr.createFishNet(seat, pos);
        }
    }

    hitedFish(fish: BYFish, seat: number) {
        if (!this.node.active) {
            return;
        }
        let p = this.game.playerMgr.getPlayerBySeat(seat);
        if (p.isMe) {
            let event = new cc.Event.EventCustom("collideFish", true);
            event.detail = { bullet: this.node, fishScript: fish };
            this.node.dispatchEvent(event);
        } else {

        }
    }
}
