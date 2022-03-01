import BYFishRoute from "../by2/script/by2FishRoute";
import { getQuadrantDegree } from "../by2/script/by2Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    private rootIdx: number = 1;

    private lastPos: cc.Vec2 = undefined;

    private moveCount: number = 0;

    start() {
        let offset = new cc.Vec2(0, 0);
        let lineCount = BYFishRoute.anchor[this.rootIdx].points.length / 2;
        let actionArr: cc.FiniteTimeAction[] = [];
        let firstTime = BYFishRoute.anchor[this.rootIdx].curveTime;

        this.label.node.setPosition(cc.v2(BYFishRoute.control[this.rootIdx].points[0 * 2][0] + offset.x, BYFishRoute.control[this.rootIdx].points[0 * 2][1] + offset.y));
        this.lastPos = cc.v2(BYFishRoute.anchor[this.rootIdx].points[0][0] + offset.x, BYFishRoute.anchor[this.rootIdx].points[0][1] + offset.y);
        this.updateRotation();

        for (let i = 0; i < lineCount; i++) {
            let c1 = cc.v2(BYFishRoute.control[this.rootIdx].points[i * 2][0] + offset.x, BYFishRoute.control[this.rootIdx].points[i * 2][1] + offset.y);
            let c2 = cc.v2(BYFishRoute.control[this.rootIdx].points[i * 2 + 1][0] + offset.x, BYFishRoute.control[this.rootIdx].points[i * 2 + 1][1] + offset.y);
            let a2 = cc.v2(BYFishRoute.anchor[this.rootIdx].points[(i + 1) * 2 - 1][0] + offset.x, BYFishRoute.anchor[this.rootIdx].points[(i + 1) * 2 - 1][1] + offset.y);
            let bezier = [c1, c2, a2];
            let callbk = cc.callFunc(() => {
                // this.moveCount++;
                // this.updateRotation();
                // console.log(111);
            });
            let bezierTo = cc.bezierTo(BYFishRoute.anchor[this.rootIdx].curveTime, bezier);
            if (firstTime != undefined && i == 0) {
                bezierTo = cc.bezierTo(firstTime, bezier);
            }
            let spa = cc.spawn(bezierTo, callbk);
            // actionArr.push(bezierTo);
            actionArr.push(spa);
        }
        console.log(actionArr.length);
        console.log(lineCount);
        cc.tween(this.label.node).then(cc.sequence(actionArr)).call(() => {
            console.log('finished')
        }).start();
    }

    update() {
        this.updateRotation();
    }

    private updateRotation() {
        let curPoint: cc.Vec2 = cc.v2(this.label.node.position);//获取鱼当前坐标
        if (this.lastPos == undefined) {
            return;
        }
        if (curPoint.x == this.lastPos.x && curPoint.y == this.lastPos.y) {
            return;
        }

        let deg: number = getQuadrantDegree(this.lastPos, curPoint);
        this.label.node.angle = deg;
        this.lastPos = curPoint;  //保存当前的坐标给下一轮刷新使用
    }
}
