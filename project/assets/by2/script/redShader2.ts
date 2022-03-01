
const { ccclass, property } = cc._decorator;

@ccclass
export default class redShader extends cc.Component {

    @property([cc.Material])
    public material: cc.Material[] = [];
    onLoad() {

    }
    setRedShaders(idx: number, mySpine: sp.Skeleton[]) {
        mySpine.forEach(element => {
            element.setMaterial(0, this.material[idx]);
        });
    }
}
