import BYGame from "./by2Game"

const { ccclass, property } = cc._decorator;

@ccclass
export default class BYIdleCheck extends cc.Component {
    public kickTime: number = 600// 多长时间没操作踢出（秒）
    public duration: number = 0// 没操作持续时间（秒）
    private beforeKickTime = 15
    private isShowTip1: boolean = false
    private isShowTip2: boolean = false
    private tipTime: number = 300// 多长时间没操作提示（秒）

    private byGame: BYGame = undefined
    onLoad() {
        this.byGame = this.node.getComponent(BYGame)
        //0执行1次，不填永久，-1不执行
        this.schedule(this.checking, 1)
    }

    checking() {
        this.duration++
        if (this.duration > this.tipTime) {
            this.tip1()
        } else {
            this.isShowTip1 = false
        }
        if (this.duration > this.kickTime - this.beforeKickTime) {
            this.tip2()
        }
        if (this.duration > this.kickTime) {
            this.leaveGame()
        }
    }

    public leaveGame() {
        this.unschedule(this.checking)
        this.byGame.endGame = true
        // this.byGame.requestLeaveGame();
    }

    private tip1() {
        if (this.isShowTip1) return
        // this.isShowTip1 = true
        // this.confirm1 = showConfirm(`亲，您${this.tipTime / 60}分钟没操作了，请继续发炮捕鱼噢~~~
        // 如果待会还没有操作，系统将请您暂时返回大厅。`)
        // this.confirm1.okFunc = () => {
        //     this.duration = 0
        // }
    }
    private tip2() {
        if (this.isShowTip2) return
        // this.isShowTip2 = true
        // let c = showConfirm(`您已经很久没有做任何操作，将在${this.beforeKickTime}秒后被请离房间`)
        // c.okFunc = () => {
        //     this.duration = 0
        //     if (this.confirm1) this.confirm1.close()
        //     this.isShowTip2 = false
        // }
    }
}