import by2Game from "./by2Game";
import BYGame from "./by2Game";
// import BYPlayer from "./by2Player";
import { massive } from "./massive2";



interface userInfo {
    money: string,
    avatar: number,
    gender: number,
    pos: number,
    location: string,
}



const { ccclass, property } = cc._decorator;

@ccclass
export default class BYPlayerMgr extends cc.Component {
    playerCount = 4;
    /**
    3 | 2
    -----
    0 | 1
    */

    public isRotate: boolean = false;
    private gunLayer: cc.Node = undefined;
    public byGame: BYGame = undefined;

    public playerArr: any[];
    public mySeat: number = 0;    // 自己在当前游戏中的位置

    clearCards() { }

    constructor(game: BYGame) {
        super();
        this.byGame = game;
        this.init();
    }

    init() {
        // let game = cc.find("game").getComponent(by2Game);
        // this.byGame = game;
        let game = this.byGame;

        this.gunLayer = this.byGame.gunLayer;

        game.players.forEach(p => {
            p.hide();
        });
        this.playerArr = game.players;
        // this.playerArr = [];
        //     for (let i in game.players) {
        //         let p = game.players[i];
        //         let newNode = cc.instantiate(p.node);
        //         p.node.parent.addChild(newNode);
        //         newNode.setSiblingIndex(p.node.getSiblingIndex() + 1);
        //         let newP = newNode.getComponent(Player);
        //         newP.seat = +i;
        //         this.playerArr.push(newP as T);
        //         p.node.active = false;
        //     }
        this.getPlayerBySeat(0).show();
    }
    // get playerArr() {
    //     return this.players;
    // }

    get me() {
        return this.playerArr[this.mySeat];
    }
    //通过seat获取玩家
    getPlayerBySeat(seat: number) {
        return this.playerArr[seat];
    }
    // 游戏中时  其他user的进入时的处理
    setPlayerEnter(data: any, reCome = false, ani = false) {
        // cc.warn("setplayer enter ", data);
        this.playerCount = 4;
        // let seat = this.toGameLocation(data.pos);
        // let realSeat = data.pos - this.seatOffset;
        // if (realSeat < 0) {
        //     realSeat += this.playerCount;
        // }
        // let p = this.getPlayerBySeat(seat);
        // if (!p) {
        //     // cc.warn("setplayer enter p is null ");
        //     return;
        // }
        // p.init(this.game);
        // p.updateId(1);
        // p.changeLevelLable(1);
        // p.showOrHideGun(true);
        // p.updateLocation(data.location)
        // // p.updatePly(data);
        // p.changeCoinLabelById(+data.money);
        // p.changeGunSp(0);
        // //-------------------------------
        // p.serverPos = data.pos;
        // this.getPlyByPos[data.pos] = p;

        // if (data.vipLevel != undefined && data.vipLevel != null) {
        //     p.upDateVipInfo(data.vipLevel, data.avatarFrame);
        // }


        // this.serverPlayers[data.pos] = p;
    }


    // 玩家离开
    setPlyLeave(pos: number) {
        // let ply = this.getPlyByPos(pos);
        // if (ply) {
        //     ply.leaveHideOthers();
        //     ply.serverPos = -1;
        //     ply.leaveAni();
        // }
    }

    // 处理自己的信息
    handleMyInfo(seat: number) {
        // cc.log('handle my info ', seat)
        // if (seat == 0 || seat == 1) {
        //     this.isRotate = false;
        // } else {
        //     seat -= 2;
        //     this.isRotate = true;
        // }
        // if (this.isRotate) {
        //     this.byGame.dieLayer.angle = -180;
        //     this.byGame.fishLayer.angle = -180;
        // }
        // this.mySeat = seat;
        // // cc.log('my seat=', this.mySeat)
        // this.byGame.byAnimMgr.showThisIsGun(seat);
        // for (let i = 0; i < 4; i++) {
        //     let p = this.getPlayerBySeat(i);
        //     if (p) {
        //         p.showOrHideGun(false);
        //         p.showWaitJoin();
        //     }
        // }
        // this.game.initMyTouchPos();
        // let p = this.getPlayerBySeat(seat);
        // if (p) {
        //     p.showMyGunBt();
        // }
    }



    // 处理进入房间时  所有USER的信息
    handleUserInfo(users: any[]) {
        // for (let i = 0; i < 4; i++) {
        //     let p = this.getPlayerBySeat(i);
        //     if (p) {
        //         p.showWaitJoin();
        //     }
        // }

        // for (let i = 0; i < users.length; i++) {
        //     let user = users[i];
        //     let seat = this.toGameLocation(user.pos)
        //     this.changeAddressLabelById(seat, user.location + user.pos);
        //     let p = this.getPlayerBySeat(seat);
        //     if (p) {
        //         // p.updateLoc(user.location);

        //         p.showOrHideGun(true);
        //     }
        //     p.emptySeat.active = false;
        // }
    }


    // 改变玩家的 地址信息
    changeAddressLabelById(gunId: number, address: string) {
        let gun = this.gunLayer.getChildByName("gun" + gunId);

        let addressLabel = gun.getChildByName("adlabel");
        addressLabel.getComponent(cc.Label).string = address;
    }


    // 把服务器中的位置  变成在本地游戏中的真实位置
    toGameLocation(pos: number) {
        if (this.isRotate) {
            if (pos < 2) {
                return pos + 2;
            } else {
                return pos - 2;
            }
        } else {
            return pos;
        }
    }

    initPlayerIsLock() {
        // this.playerArr.forEach(p => {
        //     if (p) {
        //         p.isLock = 0;
        //     }
        // });
    }

    initPlayerIsAuto() {
        // this.playerArr.forEach(p => {
        //     if (p) {
        //         p.isAuto = 0;
        //     }
        // });
    }

    playerAimCircleRotate() {
        // this.playerArr.forEach(p => {
        //     if (p) {
        //         p.aimCircleRotate();
        //     }
        // });
    }




}
