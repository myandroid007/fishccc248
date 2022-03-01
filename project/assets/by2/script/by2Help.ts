// import BasePopBox from "../../lobby/script/lobby/basePopBox";
// import ScrollViewBox from "../../lobby/script/lobby/scrollViewBox";


// const { ccclass, property } = cc._decorator;

// @ccclass
// export default class GameHelp extends BasePopBox {

//     // @property(cc.Label)
//     // protected label: cc.Label = undefined;
//     private isOpenAnim = false;
//     protected onLoad() {
//         // init logic
//         super.onLoad();
//         // this.label.string = "暂无说明";
//     }

//     showContent(str: string) {
//         // this.label.string = str;
//     }

//     openAnim(cb?: Function) {
//         if (this.isOpenAnim) {
//             return;
//         }
//         this.isOpenAnim = true;
//         this.node.active = false;
//         super.openAnim(() => {
//             this.node.active = true;

//             if (cb) {
//                 cb();
//             }
//             this.isOpenAnim = false;
//         });
//     }

// }
