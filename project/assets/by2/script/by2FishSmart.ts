// import { tar } from "../../../packages/hot-update-tools/core/compressing";
// import { User } from "../../common/script/common/user";
// import { showTip } from "../../common/script/common/util";
// import BYGame from "./by2Game";
// import { getFishRateBytype } from "./by2Util";

// const { ccclass, property } = cc._decorator;

// export enum optionType {
//     youxian = "0",//优先攻击
//     suoding = "1",//锁定攻击
//     tesu = "2",//特殊鱼
//     cancelAll = "3",
//     selectAll = "4",
// }

// @ccclass
// export default class ByFishSmart extends cc.Component {

//     @property(cc.Node)
//     switchNode: cc.Node = undefined;

//     @property(cc.Node)
//     switchOff: cc.Node = undefined;

//     @property(cc.Node)
//     switchOn: cc.Node = undefined;

//     @property(cc.Toggle)
//     bulletToggle: cc.Toggle = undefined;

//     @property([cc.Toggle])
//     optionsToggle: cc.Toggle[] = [];

//     @property(cc.EditBox)
//     bulletEdit: cc.EditBox = undefined;

//     @property(cc.Node)
//     vip6Mask: cc.Node = undefined;

//     @property(cc.Node)
//     helpNode: cc.Node = undefined;

//     /* 高倍鱼 */
//     @property(cc.Node)
//     content1: cc.Node = undefined;

//     /* 低倍鱼 */
//     @property(cc.Node)
//     content2: cc.Node = undefined;

//     private typeList: number[] = [];

//     private byGm: BYGame;

//     private attackType: string[] = [];
//     private specialList: number[] = [];
//     private bulletNum: number = 0;


//     onLoad() {
//         this.helpNode.active = false;
//         for (let i = 0; i < this.content1.children.length; i++) {
//             let item = this.content1.children[i];
//             item.getChildByName('lightbg').active = false;
//             item.getChildByName('gougou').active = false;
//             let btn = item.getChildByName("btn");
//             btn.on(cc.Node.EventType.TOUCH_END, this.onclickhight, this);
//         }

//         for (let i = 0; i < this.content2.children.length; i++) {
//             let item = this.content2.children[i];
//             item.getChildByName('lightbg').getComponent(cc.Sprite).enabled = false;
//             item.getChildByName('lightbg').getChildByName('gougou').active = false;
//             let btn = item.getChildByName('lightbg').getChildByName('btn');
//             btn.on(cc.Node.EventType.TOUCH_END, this.onclickless, this);
//         }

//         this.vip6Mask.active = User.instance.vipLevel >= 6 ? false : true;
//         this.switchNode.active = User.instance.vipLevel >= 3 ? true : false;
//     }

//     /**
//      * 点击高倍鱼
//      * @param evt
//      */
//     onclickhight(evt: cc.Event) {
//         let item = evt.currentTarget.parent;
//         if (item.getChildByName('lightbg').active) {
//             item.getChildByName('lightbg').active = false;
//             item.getChildByName('bg').active = true;
//             item.getChildByName('gougou').active = false;
//         }
//         else {
//             item.getChildByName('bg').active = false;
//             item.getChildByName('lightbg').active = true;
//             item.getChildByName('gougou').active = true;
//         }
//         this.addTypeList(item.name);
//         if (this.attackType.length < 1) {
//             this.optionsToggle[0].isChecked = true;
//             this.attackType.push(optionType.youxian);
//         }
//     }

//     /**
//      * 点击低倍鱼
//      * @param evt
//      */
//     onclickless(evt: cc.Event) {
//         let item = evt.currentTarget.parent;
//         if (item.getComponent(cc.Sprite).enabled) {
//             item.getComponent(cc.Sprite).enabled = false;
//             item.getChildByName('gougou').active = false;
//         }
//         else {
//             item.getComponent(cc.Sprite).enabled = true;
//             item.getChildByName('gougou').active = true;
//         }
//         this.addTypeList(item.parent.name);
//         if (this.attackType.length < 1) {
//             this.optionsToggle[0].isChecked = true;
//             this.attackType.push(optionType.youxian);
//         }
//     }

//     selectTesuFish(bool: boolean) {
//         for (let i = 0; i < this.content2.children.length; i++) {
//             let item = this.content2.children[i];
//             let id = item.name;
//             if (id == "91" || id == "92" || id == "94") {
//                 item.getChildByName('lightbg').getComponent(cc.Sprite).enabled = bool;
//                 item.getChildByName('lightbg').getChildByName('gougou').active = bool;
//                 this.addTypeList(id, bool);
//             }
//         }
//     }

//     /**
//      * 将所选鱼种加入列表
//      * @param type
//      */
//     private addTypeList(type: string, oType?: boolean) {
//         let tp = Number(type);
//         for (let i = 0; i < this.typeList.length; i++) {
//             if (this.typeList[i] == tp) {
//                 if (oType) {
//                     return;
//                 }
//                 else {
//                     this.typeList.splice(i, 1);
//                     return;
//                 }
//             }
//         }
//         this.typeList.push(tp);
//     }

//     /**
//      * VIP6开启功能
//      */
//     handleVip6Toggle(event: cc.Event) {
//     }

//     addBullet() {
//         this.bulletNum++;
//         this.bulletEdit.string = this.bulletNum.toString();
//     }

//     subBullet() {
//         this.bulletNum--;
//         this.bulletEdit.string = this.bulletNum.toString();
//     }

//     /**
//      * 智慧捕鱼功能选择
//      * @param evt
//      * @param type
//      */
//     handleOptionToggle(evt: cc.Toggle, type: string) {
//         /* 优先攻击和锁定攻击,二者智能选其一 */
//         if (evt.isChecked) {
//             switch (type) {
//                 case optionType.youxian:
//                     if (this.optionsToggle[1].isChecked) {
//                         this.optionsToggle[1].isChecked = false;
//                         this.cancelSelectType(optionType.suoding);
//                     }
//                     if (!this.attackType.find(item => item == type)) {
//                         this.attackType.push(type);
//                     }
//                     break;

//                 case optionType.suoding:
//                     if (this.optionsToggle[0].isChecked) {
//                         this.optionsToggle[0].isChecked = false;
//                         this.cancelSelectType(optionType.youxian);
//                     }
//                     if (!this.attackType.find(item => item == type)) {
//                         this.attackType.push(type);
//                     }
//                     break;

//                 case optionType.tesu:
//                     if (!this.attackType.find(item => item == type)) {
//                         this.attackType.push(type);
//                     }
//                     this.selectTesuFish(true);
//                     break;

//                 case optionType.cancelAll:
//                     if (this.optionsToggle[4].isChecked) {
//                         this.optionsToggle[4].isChecked = false;
//                     }
//                     if (this.optionsToggle[2].isChecked) {
//                         this.optionsToggle[2].isChecked = false;
//                     }
//                     this.handleAll(false);
//                     break;

//                 case optionType.selectAll:
//                     if (this.optionsToggle[3].isChecked) {
//                         this.optionsToggle[3].isChecked = false;
//                     }
//                     this.handleAll(true);
//                     break;

//                 default: break;
//             }
//         } else {
//             this.cancelSelectType(type);
//             if (type == optionType.tesu) {
//                 this.selectTesuFish(false);
//             }
//             else if (type == optionType.selectAll) {
//                 this.handleAll(false);
//             }
//         }
//     }

//     /**
//      * 取消选择
//      * @param type
//      */
//     cancelSelectType(type: string) {
//         for (let i = 0; i < this.attackType.length; i++) {
//             if (this.attackType[i] == type) {
//                 this.attackType.splice(i, 1);
//                 break;
//             }
//         }
//     }

//     /**
//      * 全选或者全部取消
//      * @param bool
//      */
//     handleAll(bool: boolean) {
//         this.typeList.splice(0);
//         for (let i = 0; i < this.content1.children.length; i++) {
//             let item = this.content1.children[i];
//             item.getChildByName('lightbg').active = bool;
//             item.getChildByName('gougou').active = bool;
//             item.getChildByName('bg').active = !bool;
//             if (bool) {
//                 this.addTypeList(item.name);
//             }
//         }

//         for (let i = 0; i < this.content2.children.length; i++) {
//             let item = this.content2.children[i];
//             item.getChildByName('lightbg').getComponent(cc.Sprite).enabled = bool;
//             item.getChildByName('lightbg').getChildByName('gougou').active = bool;
//             if (bool) {
//                 this.addTypeList(item.name);
//             }
//         }
//     }

//     /**
//      * 打开帮助
//      */
//     openhelpUI() {
//         this.helpNode.active = true;
//     }

//     /**
//      * 初始化
//      */
//     initData() {
//         this.bulletEdit.string = this.byGm.bulletNum.toString();
//         this.switchOff.active = !this.byGm.playerMgr.me.isSmart;
//         this.switchOn.active = this.byGm.playerMgr.me.isSmart > 0;
//         if (this.byGm.attackType == optionType.youxian) {
//             this.optionsToggle[0].isChecked = true;
//             this.attackType.push(optionType.youxian);
//         }
//         else if (this.byGm.attackType == optionType.suoding) {
//             this.optionsToggle[1].isChecked = true;
//             this.attackType.push(optionType.suoding);
//         }
//         if (this.byGm.isTesu) {
//             this.attackType.push(optionType.tesu);
//             this.optionsToggle[2].isChecked = true;
//         }
//         let list = this.byGm.smartList;
//         for (let i = 0; i < list.length; i++) {
//             this.typeList.push(list[i].type);
//         }
//         for (let j = 0; j < this.typeList.length; j++) {
//             for (let i = 0; i < this.content1.children.length; i++) {
//                 let item = this.content1.children[i];
//                 if (Number(item.name) == this.typeList[j]) {
//                     item.getChildByName('lightbg').active = true;
//                     item.getChildByName('gougou').active = true;
//                 }
//             }

//             for (let i = 0; i < this.content2.children.length; i++) {
//                 let item = this.content2.children[i];
//                 if (Number(item.name) == this.typeList[j]) {
//                     item.getChildByName('lightbg').getComponent(cc.Sprite).enabled = true;
//                     item.getChildByName('lightbg').getChildByName('gougou').active = true;
//                 }
//             }
//         }
//     }

//     /**
//      * 打开界面动画
//      * @param cb
//      */
//     openAnim(bGame: BYGame) {
//         this.byGm = bGame;
//         this.initData();
//         this.node.active = true;
//         this.node.position = cc.v3()
//         let animTime = 0.3;
//         this.node.scale = 0;
//         let actions = cc.sequence(
//             cc.scaleTo(animTime, 1, 1).easing(cc.easeBackOut()),
//             cc.callFunc(() => {

//             }),
//         )
//         cc.tween(this.node).then(actions).start();
//     }

//     /**
//      * 关闭界面动画
//      * @param cb
//      */
//     closeAction(cb?: Function) {
//         this.typeList.sort((a, b) => { return b - a });
//         if (this.byGm.playerMgr.me.isSmart) {
//             this.makeSureResult();
//         }
//         this.byGm.startFishSmart();
//         let animTime = 0.3;
//         let actions = cc.sequence(
//             cc.scaleTo(animTime, 0).easing(cc.easeBackIn()),
//             cc.callFunc(() => {
//                 this.node.active = false;
//                 this.node.destroy();
//             }))
//         cc.tween(this.node).then(actions).start();
//     }

//     /**
//      * 确定选择结果
//      */
//     makeSureResult() {
//         let temp: { type: number, rate: number }[] = [];
//         for (let i = 0; i < this.typeList.length; i++) {
//             let item = getFishRateBytype(this.typeList[i]);
//             if (this.typeList[i] == 91 || this.typeList[i] == 92 || this.typeList[i] == 94) {
//                 this.specialList.push(this.typeList[i]);
//             }
//             if (item) {
//                 temp.push({ type: item.type, rate: item.rate });
//             }
//         }
//         temp.sort((a, b) => { return b.rate - a.rate });
//         this.byGm.smartList = temp;
//         this.byGm.speciallist = this.specialList;
//         this.byGm.bulletNum = 0;
//         if (this.bulletToggle.isChecked) {
//             this.byGm.bulletNum = this.bulletNum;
//         }
//         if (this.attackType.find(item => item == optionType.youxian)) {
//             this.byGm.attackType = optionType.youxian;
//         } else if (this.attackType.find(item => item == optionType.suoding)) {
//             this.byGm.attackType = optionType.suoding;
//         }
//         else {
//             this.byGm.attackType = "";
//         }
//         this.byGm.isTesu = this.attackType.find(item => item == optionType.tesu) != undefined;
//     }

//     editboxEditingDidEnded() {
//         if (!(Number(this.bulletEdit.string))) {
//             this.bulletEdit.string = "0";
//             showTip("输入数量不合法");
//             return;
//         }
//         if (Number(this.bulletEdit.string) < 0) {
//             this.bulletEdit.string = "0";
//             showTip("输入数量不合法");
//             return;
//         }
//         this.bulletNum = Number(this.bulletEdit.string);
//     }


//     /**
//      * 智能捕鱼开关
//      */
//     handleSwitchBtn() {
//         this.specialList.splice(0);
//         if (this.byGm.playerMgr.me.isSmart) {
//             this.switchOff.active = true;
//             this.switchOn.active = false;
//             this.byGm.playerMgr.me.isSmart = 0;
//             this.byGm.smartList.splice(0);
//         }
//         else {
//             if (this.attackType.length < 1) {
//                 showTip("请选择捕捉种类");
//                 return;
//             }
//             this.makeSureResult();
//             if (this.specialList.length < 1 && this.byGm.smartList.length < 1) {
//                 showTip("请先选择鱼");
//                 return;
//             }
//             this.switchOff.active = false;
//             this.switchOn.active = true;
//             this.byGm.playerMgr.me.isSmart = 1;
//         }
//     }
// };
