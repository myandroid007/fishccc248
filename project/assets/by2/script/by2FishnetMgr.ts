import BYGame from "./by2Game";
const { ccclass, property } = cc._decorator;

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

@ccclass
export default class BYFishnetMgr extends cc.Component {

    public game: BYGame = undefined;

    private netPool: cc.Node[][] = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];


    onLoad() {
        let game = cc.find("game");
        this.game = game.getComponent(BYGame);
    }

    onDestroy() {
    }

    getOneFishNet(seat: number) {
        let p = this.game.playerMgr.getPlayerBySeat(seat);
        let oneNetPool = this.netPool[p.gunSpType];
        let fishNet = undefined;
        for (let i = 0; i < oneNetPool.length; i++) {
            fishNet = oneNetPool[i];
            if (!fishNet.active) {
                return fishNet;
            }
        }
        fishNet = cc.instantiate(p.fishNetNode);
        oneNetPool.push(fishNet);
        this.node.addChild(fishNet);
        return fishNet;
    }
    public createFishNet(seat: number, pos: cc.Vec2) {
        let p = this.game.playerMgr.getPlayerBySeat(seat);
        let net = this.getOneFishNet(seat);

        let ani: cc.Animation = net.getComponent(cc.Animation);
        net.active = true;
        net.scale = 1;
        let random3 = random(-15, 15);
        let random4 = random(-15, 15);
        net.position = cc.v2(pos.x + random3, pos.y + random4);
        if (ani) {
            ani.play();
            this.scheduleOnce(() => {
                net.active = false;
            }, 2);
        } else {
            net.opacity = 0;
            cc.tween(net).to(0.1, { opacity: 255 }).start();
            let time = 0.3;
            if (p.gunSpType > 1) {
                cc.tween(net).then(cc.rotateBy(0.55, 239)).start();
                time = 0.3;
            }

            this.scheduleOnce(() => {
                let callBack = cc.callFunc(() => {
                    net.active = false;
                });
                cc.tween(net).then(cc.sequence(cc.scaleTo(0.15, 0.39), callBack)).start();
            }, time);

        }
        return;
    }

}
