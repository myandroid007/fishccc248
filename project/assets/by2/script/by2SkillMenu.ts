// import Game from "../../common/script/game-share/game";
// import by2Game from "./by2Game";

// const { ccclass, property } = cc._decorator;

// @ccclass
// export default class by2SkillMenu extends cc.Component {
//     @property([cc.Label])
//     lab_skillNum: cc.Label[] = [];


//     @property([cc.Label])
//     lab_countdown: cc.Label[] = [];

//     @property([cc.Button])
//     btn_countdown: cc.Button[] = [];

//     @property([cc.ProgressBar])
//     progressBar_countdown: cc.ProgressBar[] = [];

//     num_countdown: number[] = [0, 0, 0, 0, 0, 0, 0];

//     num_totolTime: number[] = [0, 0, 0, 0, 0, 0, 0];

//     time_CD: number = 60;

//     isTouching = false;

//     btnEnabled = true;
//     // LIFE-CYCLE CALLBACKS:
//     game: by2Game = null;
//     onLoad() {

//         for (let i = 0; i < this.btn_countdown.length; i++) {
//             let node = this.btn_countdown[i].node;
//             node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
//             node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
//             node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
//             node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
//         }

//     }

//     onTouchStart(event, skillId) {
//         this.isTouching = true;
//         // this.game.onClickUserSkillCard(event: cc.Button, custom: string) {
//         // this.game.showMiaozhun(parseInt(event.targe.name));


//         // this._curSkillMiaozhunID = id;
//     }

//     onTouchMove(event) {

//         if (!this.btnEnabled) {
//             return;
//         }

//         if (this.isTouching) {
//             this.game.onClickUserSkillCard(event, event.target.name);
//             this.isTouching = false;
//         }

//         if (this.game.node_miaozhun.active) {
//             this.game.onMiaozhunTouchMove(event);
//         }

//     }

//     onTouchEnd(event) {
//     }
//     onTouchCancel(event) {
//         if (!this.btnEnabled) {
//             return;
//         }


//         if (this.game.node_miaozhun.active) {
//             this.game.doubleTimeEclipse = 0;
//             this.game.onMiaozhunTouchEnd(event);
//         }
//     }

//     start() {
//         for (let i = 0; i < this.lab_countdown.length; i++) {
//             this.lab_countdown[i].string = '0';
//             this.progressBar_countdown[i].progress = 0;
//             this.progressBar_countdown[i].node.active = false;
//         }

//     }

//     setSkillLab(nums: number[]) {
//         // for (let i = 0; i < this.lab_skillNum.length; i++) {
//         //     this.lab_skillNum[i].string = nums[i] + '';
//         // }
//     }

//     startCountDown(type: number) {
//         console.log('time = ', this.time_CD)
//         this.num_countdown[type - 1] = this.time_CD;
//         this.num_totolTime[type - 1] = this.time_CD;

//         // this.schedule(this.setCountDown, 1, this.num_countdown );

//     }

//     setSkillEnable(enable: boolean) {
//         this.btnEnabled = enable;
//         for (let i = 0; i < this.btn_countdown.length; i++) {
//             let node = this.btn_countdown[i];
//             node.interactable = enable;
//         }
//         if (enable) {

//         } else {
//             this.game.node_miaozhun.active = false;

//         }
//     }

//     isCDing() {
//         for (let i = 0; i < this.num_totolTime.length; i++) {
//             if (this.num_totolTime[i] > 0) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     update(dt: number) {

//         if (!this.isCDing()) {
//             return;
//         }

//         for (let i = 0; i < this.num_countdown.length; i++) {
//             if (!this.progressBar_countdown[i].node.active && this.num_countdown[i] <= 0) {
//                 continue;
//             }

//             if (this.num_countdown[i] <= 0) {
//                 // this.unschedule(this.setCountDown);
//                 this.lab_countdown[i].string = '0';
//                 this.progressBar_countdown[i].progress = 0;
//                 this.progressBar_countdown[i].node.active = false;

//                 this.num_countdown[i] = 0;
//                 this.num_totolTime[i] = 0;
//                 continue;
//             }
//             this.num_countdown[i] -= dt;

//             this.progressBar_countdown[i].node.active = true;

//             this.lab_countdown[i].string = Math.floor(this.num_countdown[i]) + '';
//             this.progressBar_countdown[i].progress = this.num_countdown[i] / this.num_totolTime[i];

//         }




//     }


// }
