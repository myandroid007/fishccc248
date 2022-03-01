
// import PopActionBox from "../../lobby/script/lobby/popActionBox";
// import BYGame from "./by2Game";
// import { fishDetail } from "./by2Util";


// const { ccclass, property } = cc._decorator;



// @ccclass
// export default class BYGunHandbook extends PopActionBox {

//     @property(cc.Node)
//     node_detail: cc.Node = null;

//     @property(cc.Node)
//     node_fishSke: cc.Node = null;

//     @property(cc.Label)
//     lab_detail_name: cc.Label = null;

//     @property(cc.Label)
//     lab_detail_rate: cc.Label = null;

//     @property(cc.Label)
//     lab_detail_speed: cc.Label = null;

//     @property(cc.Label)
//     lab_detail_kind: cc.Label = null;

//     @property(cc.Label)
//     lab_detail_level: cc.Label = null;

//     @property(cc.Label)
//     lab_detail_dec: cc.Label = null;

//     // public game: BYGame = undefined


//     // onLoad() {
//     //     super.onLoad()
//     //     let game = cc.find("game")
//     //     this.game = game.getComponent(BYGame)
//     // }


//     onClickFish(event, type) {
//         console.log('event = ', event)
//         let typeID = parseInt(event.target.name);
//         console.log('typeID = ', typeID)

//         this.node_detail.active = true;

//         this.node_fishSke.removeAllChildren();
//         let node = event.target.getChildByName('spine');
//         if (!node) {
//             node = event.target.getChildByName('mask').getChildByName('spine');
//         }
//         let fish: cc.Node = cc.instantiate(node);
//         this.node_fishSke.addChild(fish);

//         let ani = fish.getComponent(sp.Skeleton);
//         ani.animation = 'walk';
//         ani.loop = true;

//         let scaleX = this.node_fishSke.width / fish.width;
//         let scaleY = this.node_fishSke.height / fish.height;
//         scaleX = scaleX > 1 ? 1 : scaleX;
//         scaleY = scaleY > 1 ? 1 : scaleY;

//         console.log(' fish.scale 1  = ', fish.scale)
//         fish.scale = scaleX > scaleY ? scaleY : scaleX;
//         console.log(' fish.scale 2  = ', fish.scale)

//         fish.x = 0;
//         switch (typeID) {
//             case 61:
//                 console.log('1')
//                 fish.scale = fish.scale * 2.5;

//                 fish.x = 40;
//                 break;
//             case 62:
//                 console.log('2')

//                 fish.scale = fish.scale * 1.5;
//                 fish.x = 20;
//                 break;
//             case 41:
//             case 43:
//                 console.log('3')

//                 fish.x = 40;
//                 break;
//         }
//         // if (typeID == 61) {
//         //     fish.scale = fish.scale * 2.5;
//         //     console.log(' fish.scale 3  = ', fish.scale)
//         // } else if (typeID == 63) {
//         //     fish.scale = fish.scale * 1.5;
//         //     console.log(' fish.scale 3  = ', fish.scale)
//         // }


//         let detail = fishDetail[typeID + ''];
//         console.log('detail = ', detail);
//         if (detail) {
//             this.lab_detail_name.string = detail.name;
//             this.lab_detail_rate.string = detail.rate;
//             this.lab_detail_speed.string = detail.speed;
//             this.lab_detail_kind.string = detail.kind;
//             this.lab_detail_level.string = detail.level;
//             this.lab_detail_dec.string = detail.dec;
//         }





//     }


//     onClickCloseDetail(target) {
//         this.node_detail.active = false;

//     }

//     onClickClose() {

//         this.closeAction(null, false);
//     }



// }
