const festivalIDs = [101, 102, 174, 178, 128, 182, 146, 150, 154, 158, 162, 166, 170, 186]; //动态活动炮台数组  ---周返利

const rebateGunArr = [128, 146, 150, 154, 158, 162, 166, 170, 174, 178, 182, 186]; //十二星座炮台

/**
 *
 * v1和v0的夹角，象限转换
 */
export function getQuadrantDegree(v0: cc.Vec2, v1: cc.Vec2): number {
    if (v0 == undefined) return 0
    let y = (v1.y - v0.y)
    let x = (v1.x - v0.x)
    let rad = Math.atan(y / x)
    let degree = rad2Deg(rad)
    //一四象限
    if (x >= 0) {
        return -degree
    } else {
        //二三象限
        return (-degree - 180)
    }
}
/**
 * v1和v0的夹角
 */
export function getDegree(v0: cc.Vec2, v1: cc.Vec2) {
    let y = (v1.y - v0.y);
    let x = (v1.x - v0.x);
    let rad = Math.atan(y / x);
    let degree = rad2Deg(rad);
    return degree;
}
/**
 * 弧度转角度
 */
export function rad2Deg(rad: number) {
    return (rad * 180 / Math.PI)
}
/**
 * 角度转弧度
 */
export function deg2Rad(deg: number) {
    return deg * Math.PI / 180
}

export function getFishKindType(type: number) {
    return type / 10
}

/**
 * 一个玩家创建30个瞄准线的点
 */
export function createDotLine(sp: cc.Node, dotArr: cc.Node[]) {
    for (var i = 0; i < 20; i++) {
        let pot = cc.instantiate(sp);
        dotArr.push(pot);
        sp.parent.addChild(pot, -1);
    }
}
/**
 * 隐藏瞄准线
 */
export function hideDotLine(dotArr: cc.Node[]) {
    dotArr.forEach(dot => { dot.active = false })
}
/**
 * 绘制锁定状态时的瞄准线
 * @param v0 炮台位置
 * @param v1 瞄准点位置
 * @param dotArr
 */
export function drawDotLine(v0: cc.Vec2, v1: cc.Vec2, dotArr: cc.Node[]) {
    let gap = 50//间隙
    let distance = v1.sub(v0).mag()//距离
    let count = distance / gap
    let gapx = (v1.x - v0.x) / count
    let gapy = (v1.y - v0.y) / count
    let curx = 0
    let cury = 0
    for (let i = 0; i < dotArr.length; i++) {
        if (i < 3) {
            continue
        } else if (i > count) {
            if (dotArr[i].active) {
                dotArr[i].active = false
            } else {
                return
            }
        } else {
            dotArr[i].active = true
            curx = v0.x + gapx * i
            cury = v0.y + gapy * i
            dotArr[i].x = curx
            dotArr[i].y = cury
        }
    }
}

let defsMax = {
    fishId: { max: 0x1fff, bitwise: 13 },
    bulletId: { max: 0x3fff, bitwise: 14 },
    massId: { max: 0x1f, bitwise: 5 },
    ratio: { max: 0x1f, bitwise: 5 },
    angle: { max: 0xff, bitwise: 8 },
    sign: { max: 0x1, bitwise: 1 },
    pos: { max: 0x3, bitwise: 2 }
}
/**
 * 处理发子弹消息
 */
export function dealFireMsg(angle: number, ratio: number, bulletId: number): number {
    //|sign|angle|ratio|bulletid|
    if (angle < -180) {
        angle = 360 + angle
    }
    angle = Math.round(angle)
    if (ratio < 0 || ratio > defsMax.ratio.max) console.error('ratio超出范围了！！！！！')
    if (angle < -defsMax.angle.max || ratio > defsMax.angle.max) console.error('angle超出范围了！！！！！')
    if (bulletId < 0 || ratio > defsMax.bulletId.max) console.error('bulletId超出范围了！！！！！')

    let sign = angle < 0 ? 1 : 0
    sign = sign << (defsMax.bulletId.bitwise + defsMax.ratio.bitwise + defsMax.angle.bitwise)
    angle = (Math.abs(angle) & defsMax.angle.max) << (defsMax.bulletId.bitwise + defsMax.ratio.bitwise)
    ratio = (ratio & defsMax.ratio.max) << defsMax.bulletId.bitwise
    bulletId = (bulletId & defsMax.bulletId.max) << 0
    return sign | angle | ratio | bulletId
}
/**
 * 处理击中消息
 */
export function dealHitMsg(massId: number, fishId: number, bulletId: number): number {
    //|massid|fishid|bulletid|
    if (massId < 0 || massId > defsMax.massId.max) console.error('massId超出范围了！！！！！');
    if (fishId < 0 || fishId > defsMax.fishId.max) console.error('fishid超出范围了！！！！！');
    if (bulletId < 0 || bulletId > defsMax.bulletId.max) console.error('bulletId超出范围了！！！！！');

    massId = (massId & defsMax.massId.max) << (defsMax.fishId.bitwise + defsMax.bulletId.bitwise);
    fishId = (fishId & defsMax.fishId.max) << defsMax.bulletId.bitwise;
    bulletId = (bulletId & defsMax.bulletId.max) << 0;
    return massId | fishId | bulletId;
}

export function resolveFireMsg(data: number) {
    // sign|angle|pos|ratio
    let sign = (data >> (defsMax.angle.bitwise + defsMax.pos.bitwise + defsMax.ratio.bitwise)) & defsMax.sign.max;
    let xangle = (data >> (defsMax.pos.bitwise + defsMax.ratio.bitwise)) & defsMax.angle.max;
    if (sign) xangle = -xangle;
    let xrPos = (data >> (defsMax.ratio.bitwise)) & defsMax.pos.max;
    let xratio = (data >> 0) & defsMax.ratio.max;
    let info = {
        angle: xangle,
        pos: xrPos,
        ratio: xratio
    }
    return info
}

// 获取是否为周返利炮台
export function isFestivalGuns(gunsID: number) {
    return (festivalIDs.indexOf(gunsID) >= 0);
}


//获取是否为十二星座炮台
export function isRebateGunArr(gunsID: number) {
    return (rebateGunArr.indexOf(gunsID) >= 0);
}


let fishDefs = [
    { type: 11, rate: 2, boom: "0.475000", bodyType: 1, trajectory: [11, 14], group: true },
    { type: 12, rate: 3, boom: "0.316667", bodyType: 1, trajectory: [12, 15], group: true },
    { type: 13, rate: 4, boom: "0.237500", bodyType: 1, trajectory: [13, 16], group: true },
    { type: 14, rate: 5, boom: "0.190000", bodyType: 1, trajectory: [14, 17], group: true },
    { type: 15, rate: 6, boom: "0.158333", bodyType: 1, trajectory: [15, 18], group: true },
    { type: 16, rate: 7, boom: "0.135714", bodyType: 1, trajectory: [16, 19], group: true },
    { type: 17, rate: 8, boom: "0.118750", bodyType: 1, trajectory: [20, 20], group: true },
    { type: 18, rate: 10, boom: "0.095000", bodyType: 1, trajectory: [26, 26], group: true },
    { type: 21, rate: 12, boom: "0.079167", bodyType: 2, trajectory: [21, 26] },
    { type: 22, rate: 15, boom: "0.063333", bodyType: 2, trajectory: [22, 27] },
    { type: 23, rate: 18, boom: "0.052778", bodyType: 2, trajectory: [23, 28] },
    { type: 24, rate: 20, boom: "0.047500", bodyType: 2, trajectory: [24, 29] },
    { type: 25, rate: 20, boom: "0.047500", bodyType: 2, trajectory: [25, 21] },
    { type: 26, rate: 20, boom: "0.047500", bodyType: 2, trajectory: [26, 22] },
    { type: 27, rate: 25, boom: "0.038000", bodyType: 2, trajectory: [27, 20] },
    { type: 31, rate: 30, boom: "0.031667", bodyType: 3, trajectory: [31, 31] },
    { type: 32, rate: 30, boom: "0.031667", bodyType: 3, trajectory: [32, 37] },
    { type: 33, rate: 35, boom: "0.027143", bodyType: 3, trajectory: [33, 38] },
    { type: 34, rate: 40, boom: "0.023750", bodyType: 3, trajectory: [34, 39] },
    { type: 35, rate: 45, boom: "0.021111", bodyType: 3, trajectory: [35, 30] },
    { type: 41, rate: 55, boom: "0.017273", bodyType: 4, trajectory: [41, 44] },
    { type: 42, rate: 60, boom: "0.015833", bodyType: 4, trajectory: [42, 45] },
    { type: 43, rate: 65, boom: "0.014615", bodyType: 4, trajectory: [43, 46] },
    { type: 44, rate: 70, boom: "0.013571", bodyType: 4, trajectory: [44, 47] },
    { type: 45, rate: 80, boom: "0.011875", bodyType: 4, trajectory: [45, 48] },
    { type: 51, rate: 100, boom: "0.009500", trajectory: [51, 56], cdTime: [2 * 60, 5 * 60], scenes: 1, isBoss: true, isDelay: true, exclusive: true },
    { type: 52, rate: 110, boom: "0.008636", trajectory: [52, 57], cdTime: [2 * 60, 5 * 60], scenes: 2, isBoss: true, isDelay: true, exclusive: true },
    { type: 53, rate: 120, boom: "0.007917", trajectory: [53, 58], cdTime: [2 * 60, 5 * 60], scenes: 3, isBoss: true, isDelay: true, exclusive: true },
    // { type: 54, rate: 150, boom: "0.006333", trajectory: [54, 69], cdTime:  [2 * 60, 5 * 60] ,scenes: 4, isBoss: true},
    // { type: 55, rate: 200, boom: "0.004750", trajectory: [55, 60], cdTime:  [2 * 60, 5 * 60] ,scenes: 5, isBoss: true},
    { type: 61, rate: 300, boom: "0.003167", trajectory: [61, 66], cdTime: [10 * 60, 15 * 60], isBoss: true, isDelay: true, exclusive: true },
    { type: 62, rate: 350, boom: "0.002714", trajectory: [62, 67], cdTime: [10 * 60, 15 * 60], isBoss: true, isDelay: true, exclusive: true },
    { type: 63, rate: 300, boom: "0.003167", trajectory: [63, 69], cdTime: [10 * 60, 15 * 60], isBoss: true, isDelay: true, exclusive: true },
    { type: 71, rate: 200, boom: "0.002375", trajectory: [71, 75], isBoss: true, isDelay: true, exclusive: true },//2个头  一个200倍
    { type: 72, rate: 800, boom: "0.001188", trajectory: [72, 76], isBoss: true, isDelay: true, exclusive: true },
    { type: 81, rate: 30, boom: "0.021111", bodyType: 4, trajectory: [71, 75], skillId: 1 },
    { type: 82, rate: 30, boom: "0.031667", bodyType: 4, trajectory: [72, 76], skillId: 2 },
    { type: 83, rate: 60, boom: "0.031667", bodyType: 5, trajectory: [71, 75], skillId: 3 },
    { type: 84, rate: 30, boom: "0.011875", bodyType: 4, trajectory: [72, 76], skillId: 4 },
    { type: 85, rate: 30, boom: "0.031667", bodyType: 4, trajectory: [71, 75], skillId: 5 },
    { type: 86, rate: 10, boom: "0.095000", bodyType: 1, trajectory: [72, 76], skillId: 6 },
    { type: 87, rate: 80, boom: "0.015833", bodyType: 5, trajectory: [71, 75], skillId: 7 },
];

let fishDecs = [
    { type: 11, rate: '250-300', name: '小丑鱼', speed: '快', level: '容易', dec: '它机灵调皮，聪明好动，同时也有点八卦，喜欢游来游去探听各种八卦' },
    { type: 11, rate: '250-300', name: '小丑鱼', speed: '快', level: '容易', dec: '它机灵调皮，聪明好动，同时也有点八卦，喜欢游来游去探听各种八卦' },
    { type: 11, rate: '250-300', name: '小丑鱼', speed: '快', level: '容易', dec: '它机灵调皮，聪明好动，同时也有点八卦，喜欢游来游去探听各种八卦' },
];

//鱼种类倍数查询
export function getFishRateBytype(type: number) {
    for (let i = 0; i < fishDefs.length; i++) {
        if (type == fishDefs[i].type) {
            return fishDefs[i];
        }
    }
}

export enum SkillType {
    Multiplying = 1, //倍增卡
    Boom = 2,//炸弹卡
    Lightning = 3, //闪电卡
    Renju = 4, //连珠卡
    Electromagnetic = 5,//电磁炮卡
    Frozen = 6,//冰冻卡
    Drill = 7,//钻头卡
}

export const fishDetail = {
    11: { kind: '微型鱼', rate: '2', name: '小飞鱼', speed: '快', level: '容易', dec: '别看它们小，它们可是能制造头疼的熊孩子。' },
    12: { kind: '微型鱼', rate: '3', name: '小丑鱼', speed: '慢', level: '容易', dec: '它机灵调皮、聪明好动，同时也有点八卦，喜欢游来游去探听各种秘密。' },
    13: { kind: '微型鱼', rate: '4', name: '旗鱼', speed: '快', level: '容易', dec: '它的攻击力特强，它那骨质利剑，尖长喙状物部，非常坚硬。' },
    14: { kind: '微型鱼', rate: '5', name: '小乌贼', speed: '缓慢', level: '容易', dec: '它悠哉悠哉爱晃悠，闲来无事总想搞个恶作剧，制造些大新闻。' },
    15: { kind: '微型鱼', rate: '6', name: '斑马鱼', speed: '慢', level: '容易', dec: '出现在珊瑚丛中的神奇鱼种，喜欢清净，但总是找不到适合隐居的地方。' },
    16: { kind: '微型鱼', rate: '7', name: '蓝吊', speed: '快', level: '容易', dec: '喜欢随波逐流，自以为很聪明，却总像少了根筋。' },
    17: { kind: '微型鱼', rate: '8', name: '球迷鱼', speed: '慢', level: '容易', dec: '青春活力爱冒险的它爱管闲事，经常在中途被其他事物吸引。' },
    18: { kind: '小型鱼', rate: '10', name: '河豚', speed: '缓慢', level: '容易', dec: '是个 迷迷糊糊的路痴，遇事也总是慢半拍，说它笨它还很委屈。' },
    21: { kind: '小型鱼', rate: '12', name: '斑点鱼', speed: '慢', level: '容易', dec: '凶猛的肉食性鱼类，且较为贪食，不过这只看起来咋还有点可爱咧！' },
    22: { kind: '小型鱼', rate: '15', name: '海马', speed: '缓慢', level: '容易', dec: '仗着自己年纪大，喜欢讲些奇奇怪怪的故事偏偏小朋友，但关键时刻还是很靠谱的。' },
    23: { kind: '小型鱼', rate: '18', name: '绿齿鱼', speed: '快', level: '容易', dec: '它喜欢拦截海上的船只，总想着靠吓晕航行者发一笔横财。' },
    24: { kind: '小型鱼', rate: '20', name: '霓裳', speed: '慢', level: '容易', dec: '天生丽质，小巧可爱，但总是争强好胜，攀比。久而久之除了讨厌并没有留下任何好的印象。' },
    25: { kind: '中型鱼', rate: '20', name: '沙丁鱼群', speed: '慢', level: '一般', dec: '最喜欢制造“沙丁鱼风暴”，气场强，但毫无威胁' },
    26: { kind: '中型鱼', rate: '20', name: '金鲤鱼群', speed: '慢', level: '一般', dec: '当它们组团出现时，带来的将是飞黄腾达的好运~' },
    27: { kind: '中型鱼', rate: '25', name: '灯笼鱼', speed: '慢', level: '一般', dec: '总是举起头顶明灯，到处游来游去的群找着什么～' },
    31: { kind: '中型鱼', rate: '30', name: '剑鱼', speed: '快', level: '一般', dec: '长长的颚骨能使它在水里快速的游动，同时也是发起攻击的利器！' },
    32: { kind: '中型鱼', rate: '30', name: '小龙虾', speed: '慢', level: '一般', dec: '励志要成为龙虾将军的人物，但是却时时刻刻考虑着香辣的好吃还是麻辣的好吃！' },
    33: { kind: '中型鱼', rate: '35', name: '锦绣龙虾', speed: '快', level: '一般', dec: '自带土豪气质，风风火火的出场让人惊叹不已！' },
    34: { kind: '中型鱼', rate: '40', name: '白鳍', speed: '慢', level: '一般', dec: '海洋里真正的杀手，喜欢独来独往是它的风格！' },
    35: { kind: '中型鱼', rate: '45', name: '鳄鱼', speed: '慢', level: '一般', dec: '看什么看～就是嘴大了点，海陆两栖的猎食者和清道夫！' },
    41: { kind: '大型鱼', rate: '55', name: '大白鲨', speed: '快', level: '一般', dec: '深海中很有地位且行事低调、彬彬有礼，有关它一些传说和惊悚的故事仍在流传，不知道到底是真还是假。' },
    42: { kind: '大型鱼', rate: '60', name: '锯齿鲨', speed: '快', level: '一般', dec: '深海中的霸主，嗯～它自己是这么认为的！' },
    43: { kind: '大型鱼', rate: '65', name: '虎头鲸', speed: '快', level: '一般', dec: '黑社会老大范，可谁知道它只是空有样子而已，它最喜欢吃的其实是海草寿司～' },
    44: { kind: '大型鱼', rate: '70', name: '招财金龟', speed: '慢', level: '难', dec: '龙王的管家，不过好像只是掌管着着龙王的私房钱，呃～' },
    45: { kind: '大型鱼', rate: '80', name: '七彩海星', speed: '慢', level: '难', dec: '浑身都是棘皮的海洋动物，有着奇特的星状身体，能利用自己的身体洞察一切！' },
    51: { kind: '超大型鱼', rate: '100', name: '金头鲸', speed: '慢', level: '难', dec: '本想弄套金光闪闪的时装来炫耀自己的财富，结果却吸引了大家强大的火力～' },
    52: { kind: '超大型鱼', rate: '110', name: '金钱鲤', speed: '快', level: '难', dec: '游姿高雅，体型优美，嗯～总之一看就知道很尊贵，属于鱼中的贵族！' },
    53: { kind: '超大型鱼', rate: '120', name: '招财金蟾', speed: '快', level: '难', dec: '它天性喜欢金银财宝，对钱财有敏锐洞悉力，所以拥有富可敌国的财富！' },
    54: { kind: '超大型鱼', rate: '150', name: '撼海蓝鲸', speed: '慢', level: '难', dec: '知道我名字怎么来的吗？看我的大块头就明白了，憨厚憨厚的小萌鲸一只。' },
    55: { kind: '超大型鱼', rate: '200', name: '拨海玄龟', speed: '慢', level: '难', dec: '每次出场都让我转来转去，你知道我有多烦吗？若非每次出场都有鱼儿吃，我早就罢工了 ' },

    61: { kind: '巨大型鱼', rate: '300', name: '人鱼公主', speed: '快', level: '难', dec: '美人鱼之吻，可以让所有男人目眩神迷~没错，就是说你~' },
    62: { kind: '巨大型鱼', rate: '350', name: '四海龙王', speed: '快', level: '难', dec: '统治四海的龙王，当年水淹陈唐关让人胆战心惊！' },
    63: { kind: '巨大型鱼', rate: '300', name: '霸王乌贼', speed: '快', level: '难', dec: '它是传说中的深海怪物，据说从来没人能见到它的真面目！' },
    71: { kind: '巨型鱼', rate: '400', name: '基多拉第一形态', speed: '慢', level: '难', dec: '它不属于地球，它的出现意味着整个大海的秩序需要重建，这个可怕的家伙会让所有人陷入绝望！' },
    72: { kind: '巨型鱼', rate: '800', name: '基多拉第二形态', speed: '慢', level: '难', dec: '你以为它倒下了？第二形态的它被愤怒所包裹，熔岩般的皮肤能让一切融化！击败它将是不可能的事' },


    81: { kind: '中型鱼', rate: '45', name: '倍增河豚', speed: '慢', level: '一般', dec: '从实验室偷跑出来的生物，当捕获它之后，可给全场带来额外的运气！' },
    82: { kind: '大型鱼', rate: '30', name: '炸弹蟹', speed: '慢', level: '一般', dec: '移动炸弹，风风火火，不计后果，跌跌撞撞不知悔改，最后不小心就自己爆炸了！被捕后造成强力的爆炸殃及池鱼。' },
    83: { kind: '中型鱼', rate: '30', name: '闪电水母', speed: '慢', level: '一般', dec: '神秘的海洋生物，生来就具有闪电能力，不想靠近其他鱼却也时不时刷存在感！被捕获后释放闪电链电击周围的鱼。' },
    84: { kind: '大型鱼', rate: '80', name: '连环炸弹蟹', speed: '慢', level: '一般', dec: '弹药库的搬运工，不过好像只对炸弹感兴趣，被捕后造成多次强力的爆炸殃及池鱼。' },
    85: { kind: '中型鱼', rate: '30', name: '电磁蟹', speed: '慢', level: '一般', dec: '科学研究的先驱，拥有超出文明科技的武器，捕获后获得特殊武器电磁炮，可进行大范围攻击。' },
    86: { kind: '中型鱼', rate: '10', name: '冰晶水母', speed: '慢', level: '一般', dec: '神秘的海洋生物，生来就具有冰冻一切的能力，本想用冰冷的魅力去吸引别人，却总是不小心就冰封了一切。捕获后冰封周围的鱼。' },
    87: { kind: '中型鱼', rate: '60', name: '钻头蟹', speed: '慢', level: '一般', dec: '捕获后获得特殊武器钻头炮，可进行全范围攻击。' },
};



let bossFishType = [61, 62, 63];   // bossType

let worldBoss1FishType = [71];   // bossType
let worldBoss2FishType = [72];   // bossType


export function isBoss(num: number) {
    return bossFishType.indexOf(num) >= 0;
}

export function isWorldBoss1(num: number) {
    return worldBoss1FishType.indexOf(num) >= 0;
}
export function isWorldBoss2(num: number) {
    return worldBoss2FishType.indexOf(num) >= 0;
}

let skillFishType = [81, 82, 83, 84, 85, 86, 87];   // bossType
export function isSkillFish(num: number) {
    return skillFishType.indexOf(num) >= 0;
}