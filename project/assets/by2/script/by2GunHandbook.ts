
// import PopActionBox from "../../lobby/script/lobby/popActionBox";
// import BYGame from "./by2Game"
// import { isFestivalGuns } from "./by2Util";

// const { ccclass, property } = cc._decorator;



// @ccclass
// export default class BYGunHandbook extends PopActionBox {

//     @property(cc.Node)
//     private content: cc.Node = undefined

//     @property(cc.Node)
//     private tip: cc.Node = undefined

//     @property([cc.SpriteFrame])
//     sfBtn: cc.SpriteFrame[] = [];

//     @property(cc.Node)
//     private tips1: cc.Node = undefined

//     @property(cc.Label)
//     private tip_weijiesuo: cc.Label = undefined

//     @property(cc.Prefab)
//     exp: cc.Prefab = undefined;

//     @property(cc.Node)
//     gunbg: cc.Node = undefined;

//     @property(cc.Node)
//     gunsp: cc.Node = undefined;

//     @property(cc.Node)
//     flame: cc.Node = undefined;

//     @property(cc.Label)
//     lab_lock: cc.Label = undefined;


//     @property([cc.Node])
//     node_skillPanel: cc.Node[] = [];

//     public game: BYGame = undefined


//     onLoad() {
//         super.onLoad()
//         let game = cc.find("game")
//         this.game = game.getComponent(BYGame)

//         this.onClickSkillTag(null,'1');
//     }

//     protected start() {
//         this.openAnim();
//     }

//     openAnim() {
//         super.openAnim();
//         // for (let i = 1; i < this.content.children.length; i++) {
//         //     let item = this.content.children[i];
//         //     let label = item.getChildByName("beishu");
//         //     label.getComponent(cc.Label).string = "累充" + this.game.gunCfg[i].coin + "元";
//         // }
//         this.init()
//         // this.setChangeGunLayerMoney()
//     }


//     async init() {


//         this.setButtonGray(this.game.myMaxGunSp);


//         for (let i = 0; i < this.content.children.length; i++) {
//             let item = this.content.children[i];
//             let btn = item.getChildByName("button")
//             if (item.name == this.game.playerMgr.me.gunSpType.toString()) {
//                 item.getChildByName("sy").active = false;
//                 item.getChildByName("syz").active = true;

//                 // this.onClickEffect(btn, i + '');

//                 this.changeGunSp(i);
//                 let str = '使用中'
//                 this.tip_weijiesuo.string = str;

//                 // item.getChildByName("bgsy").active = true;
//             } else {
//                 item.getChildByName("sy").active = true;
//                 item.getChildByName("syz").active = false;
//                 // item.getChildByName("bgsy").active = false;
//             }
//         }
//         this.node.on("close", () => {
//             this.game.hideChangeGunBtn();
//         });
//     }

//     setButtonGray(garde: number) {
//         for (let i = 0; i < this.content.children.length; i++) {
//             let item = this.content.children[i];
//             let btn = item.getChildByName("button")
//             if (garde < +item.name) {
//                 item.getChildByName("sy").active = false;
//                 item.getChildByName("syz").active = false;
//                 // item.getChildByName("bgsy").active = true;
//                 // item.getChildByName("bgsy").getComponent(cc.Sprite).spriteFrame = this.sfBtn[0];
//                 item.getChildByName("hq").active = true;
//             } else {
//                 item.getChildByName("sy").active = true;
//                 item.getChildByName("syz").active = false;
//                 item.getChildByName("hq").active = false;
//             }

//         }
//         // if (this.game.myFestivalGuns.length > 0) {
//         //     for (let i = 0; i < this.game.myFestivalGuns.length; i++) {
//         //         let item = this.content.getChildByName(this.game.myFestivalGuns[i].toString());
//         //         if (!item) continue;
//         //         // item.getChildByName("button").getChildByName("bgsy").getComponent(cc.Sprite).spriteFrame = this.sfBtn[0];
//         //         item.getChildByName("sy").active = true;
//         //         item.getChildByName("hq").active = false;
//         //         // item.getChildByName("button").getChildByName("bgsy").active = false;
//         //     }
//         // }
//         // if (this.game.playerMgr.me.gunSpType >= 12) {
//         //     let name = this.getGunSpineIndex(this.game.playerMgr.me.gunSpType).toString();
//         //     let item = this.content.getChildByName(name);
//         //     let btn = item.getChildByName("button")
//         //     item.getChildByName("sy").active = false;
//         //     item.getChildByName("syz").active = true;
//         //     // let bs = item.getChildByName("bgsy")
//         //     // bs.getComponent(cc.Sprite).spriteFrame = this.sfBtn[1];
//         //     // bs.active = true;
//         // }


//     }

//     /**
//     * 在resArr获取对应炮台的index
//     */
//     getGunSpineIndex(type: number): number {
//         let index;
//         switch (type) {
//             case 12:
//                 index = 170
//                 break;
//             case 13:
//                 index = 174
//                 break;
//             case 14:
//                 index = 178
//                 break;
//             case 15:
//                 index = 186
//                 break;
//             case 16:
//                 index = 128
//                 break;
//             case 17:
//                 index = 182
//                 break;
//             case 18:
//                 index = 146
//                 break;
//             case 19:
//                 index = 150
//                 break;
//             case 20:
//                 index = 154
//                 break;
//             case 21:
//                 index = 158
//                 break;
//             case 22:
//                 index = 162
//                 break;
//             case 23:
//                 index = 166
//                 break;
//             default:
//                 break;
//         }
//         return index

//     }

//     setChangeGunLayerMoney() {

//         let moneyLabel = this.tip.getChildByName("money");
//         moneyLabel.getComponent(cc.Label).string = this.game.amount
//         let lvsp = this.tip.getChildByName("lvsp");
//         let spx = this.game.myMaxGunSp + 2;
//         if (spx > 8) {
//             spx = 8;
//             // this.tip.active = false;
//         }
//         let spxx = "s" + spx;
//         lvsp.getChildByName(spxx).active = true;
//     }
//     // 换炮 按钮点击
//     public onClickUse(event: cc.Event, gradeStr: string) {
//         let grade = +gradeStr
//         if ((!isFestivalGuns(grade) && +grade > this.game.myMaxGunSp)
//             || (isFestivalGuns(grade) && this.game.myFestivalGuns.indexOf(grade) < 0)) {
//             // 点击了获取按钮
//             this.game.withdrawBtClick(grade);
//             return;
//         }
//         let me = this.game.playerMgr.me;
//         if (me) {
//             me.changeGunSp(grade);
//         }
//         this.closeAction(null, false);

//         this.game.msg.gameBYHandlerBulletStyle(grade.toString());
//     }

//     public onClickEffect(event, gradeStr: string) {
//         let grade = parseInt(gradeStr);
//         console.log('grade = ', grade)
//         this.changeGunSp(grade);

//         let isHave = event.target.parent.getChildByName("hq").active;
//         console.log('isHave = ', isHave);
//         let str = '未解锁'
//         if (!isHave) {
//             let isUseing = event.target.parent.getChildByName("syz").active;
//             if (isUseing) {
//                 str = '使用中'
//             } else {
//                 str = '已拥有'
//             }
//         }
//         this.tip_weijiesuo.string = str;
//     }

//     changeGunSp(type: number) {
//         //cc.log("------- this.type", type)

//         let resnode: cc.Node = this.game.getGunRes(type);
//         //cc.log("------- this.resnode", resnode)
//         let gun = resnode.getChildByName("gun");
//         let flame = resnode.getChildByName("flame");
//         let bullet = resnode.getChildByName("bullet");

//         let gunbg = resnode.getChildByName("gunbg");
//         if (gunbg) {
//             let gunbgres = cc.instantiate(gunbg);
//             this.gunbg.addChild(gunbgres);
//         } else {
//             if (this.gunbg) {
//                 this.gunbg.removeAllChildren();
//             }
//         }
//         // for (let index = 0; index < this.gunsp.childrenCount; index++) {
//         //     if (this.gunsp.children[index].name !== "firesp") {
//         //         this.gunsp.children[index].active = false;
//         //     }
//         // }

//         this.gunsp.removeAllChildren();

//         let gun2 = this.gunsp.getChildByName('gun')
//         if (gun2) {
//             gun2.removeFromParent();
//         }
//         let gun3 = cc.instantiate(gun);
//         gun3.removeFromParent(false);
//         this.gunsp.addChild(gun3);
//         let skeleton = gun3.getComponent(sp.Skeleton)
//         // skeleton.animation = 'shoot'
//         // skeleton.loop = true;

//         skeleton.setAnimation(0, "shoot", true);
//         gun3.x = 0;
//         gun3.y = -10;
//         // } else {

//         //     this.gunsp.enabled = true;
//         //     this.gunsp.spriteFrame = gun.getComponent(cc.Sprite).spriteFrame;
//         // }
//         this.flame.removeAllChildren();

//         let node = cc.instantiate(flame);
//         node.x = 0;
//         node.y = 0;
//         this.flame.addChild(node);

//         let ani_flame = node.getComponent(cc.Animation);
//         if (!ani_flame) {
//             let ani_flames = node.getComponentsInChildren(cc.Animation);
//             for (let item of ani_flames) {
//                 let state = item.play();
//                 state.repeatCount = Infinity;
//             }
//         } else {
//             let state = ani_flame.play();
//             state.repeatCount = Infinity;
//         }
//     }

//     onClickClose() {

//         this.closeAction(null, false);
//     }


//     onClickSkillTag(event: any, custom: string) {

//         for (let i = 0; i < this.node_skillPanel.length; i++) {
//             let panel = this.node_skillPanel[i];
//             panel.active = false;
//         }

//         let panel = this.node_skillPanel[parseInt(custom) - 1];
//         panel.active = true;

//     }


// }
