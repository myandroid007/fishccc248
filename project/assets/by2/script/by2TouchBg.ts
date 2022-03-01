import BYGame from "./by2Game"

const { ccclass, property } = cc._decorator

@ccclass
export default class BYTouchBg extends cc.Component {
    public byGame: BYGame = undefined

    onLoad() {
        let game = cc.find("game")
        this.byGame = game.getComponent(BYGame)
        this.initTouchEvent()
    }

    initTouchEvent() {
        let self = this
        //按下
        this.byGame.nodeCanvas.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {

            if (!self.byGame.canStart) {
                return
            }
            // let me = self.byGame.playerMgr.me
            var pos = event.getTouches()[0].getLocation()
            let tmpPos = self.byGame.touch2GamePos(pos)

            self.byGame.curTouchPos = tmpPos
            // self.byGame.hideChangeGunBtn()
            // if (me.isLock === 1) {
            //     return
            // }
            // me.changeGunRotation(tmpPos);
            // if (me.isAuto) {
            //     self.byGame.changeAutoDegAndPost()
            //     return
            // }
            self.byGame.bulletMgr.shoot(0, tmpPos)
            self.unschedule(self.keepShooting)
            self.schedule(self.keepShooting, BYGame.STEP_TIME)
        }, this)
        //移动
        this.byGame.nodeCanvas.on(cc.Node.EventType.TOUCH_MOVE, function (event: cc.Event.EventTouch) {
            // let me = self.byGame.playerMgr.me
            // if (me.isLock === 1 && me.lockFish != undefined) {
            //     return
            // }
            let touchPos = event.getLocation()
            let tmpPos = self.byGame.touch2GamePos(touchPos)
            self.byGame.curTouchPos = tmpPos
            // if (me.isAuto) {
            //     self.byGame.changeAutoDegAndPost()
            //     return
            // }
            // me.changeGunRotation(tmpPos);

        }, this)
        //结束
        this.byGame.nodeCanvas.on(cc.Node.EventType.TOUCH_END, function (event: cc.Event.EventTouch) {
            self.unschedule(self.keepShooting)
        }, this)
        //结束
        this.byGame.nodeCanvas.on(cc.Node.EventType.TOUCH_CANCEL, function (event: cc.Event.EventTouch) {
            self.unschedule(self.keepShooting)
        }, this)
    }
    /**
     * 持续发射子弹
     */
    keepShooting() {
        this.byGame.shootBullet()
    }

}
