const { ccclass, property } = cc._decorator;

@ccclass
export default class BYDiancipao extends cc.Component {

    @property(cc.Animation)
    ani_bg: cc.Animation = null;

    @property(cc.Animation)
    ani_jiguang: cc.Animation = null;

    @property(cc.BoxCollider)
    boxCollider_bullet: cc.BoxCollider = null;

    start() {

    }

    playDianCiPao() {

        this.node.opacity = 255;
        this.ani_bg.play();
        this.ani_jiguang.stop();
        this.ani_jiguang.play('start');
        this.boxCollider_bullet.enabled = false;
        this.scheduleOnce(() => {
            this.ani_jiguang.stop();
            this.boxCollider_bullet.enabled = true;
            this.ani_jiguang.play('jiguangshooting');
            this.scheduleOnce(this.stop, 1.7);


        }, 0.3)


    }

    stop() {
        this.unscheduleAllCallbacks();
        this.ani_jiguang.stop();
        this.ani_jiguang.play('end');

        this.boxCollider_bullet.enabled = false;
        let ac = cc.sequence(cc.delayTime(0.3), cc.fadeOut(0.15), cc.callFunc(() => {
            this.node.active = false;
        }));
        this.node.runAction(ac);
    }

    playStop() {

    }
}
