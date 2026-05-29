import type { FeedSource } from "@/types/feed";

/**
 * B站 VTuber / VUP（皮套人）订阅配置
 *
 * 已过滤：已毕业、停止运营（罗伊Roi、文静千鸟、千鸟全员等）
 * 添加方式：在对应分组追加一项，填写 UID 和名称即可。
 * UID 获取：打开 UP 主个人主页，地址栏 /space.bilibili.com/ 后面的数字。
 */
export const FEED_SOURCES: FeedSource[] = [
  // ═══════════ A-SOUL（字节 × 乐华 | 2026冰火盛典参演） ═══════════
  { uid: "672328094", name: "嘉然今天吃什么", note: "A-SOUL" },
  { uid: "672353429", name: "贝拉kira", note: "A-SOUL" },
  { uid: "672342685", name: "乃琳Queen", note: "A-SOUL" },
  { uid: "672346917", name: "向晚大魔王", note: "A-SOUL" },

  // ═══════════ 四禧丸子（B站官方虚拟女团 | 2026冰火参演） ═══════════
  { uid: "1085927736", name: "四禧丸子_Official", note: "四禧丸子" },
  { uid: "529279", name: "恬豆Bekki", note: "四禧丸子" },
  { uid: "475416", name: "梨安Lian", note: "四禧丸子" },
  { uid: "1557864", name: "沐霂是MUMU呀", note: "四禧丸子" },
  { uid: "649529", name: "又一充电中", note: "四禧丸子" },

  // ═══════════ EOE（乐华虚拟女团） ═══════════
  { uid: "1807256993", name: "EOE组合", note: "EOE" },
  { uid: "1939766591", name: "莞儿睡不醒", note: "EOE" },
  { uid: "1912362542", name: "虞莫MOM", note: "EOE" },
  { uid: "1855648354", name: "柚恩不加糖", note: "EOE" },
  { uid: "1930348333", name: "露早Aya", note: "EOE" },

  // ═══════════ VirtuaReal（B站 × 彩虹社） ═══════════
  { uid: "434334701", name: "七海Nana7mi", note: "VirtuaReal" },
  { uid: "7706705", name: "阿梓从小就很可爱", note: "VirtuaReal" },
  { uid: "34574768", name: "艾因Eine", note: "VirtuaReal" },
  { uid: "284416", name: "中单光一", note: "VirtuaReal" },
  { uid: "368073310", name: "阿萨Aza", note: "VirtuaReal" },
  { uid: "690022", name: "呜米", note: "VirtuaReal" },
  { uid: "745493", name: "咩栗", note: "VirtuaReal" },
  { uid: "30145306", name: "小可学妹", note: "VirtuaReal" },
  { uid: "1731997197", name: "菜菜子", note: "VirtuaReal Star" },

  // ═══════════ P-SP ═══════════
  { uid: "33270445", name: "白神遥Haruka", note: "P-SP" },

  // ═══════════ 国V 个人势 / 知名企划 ═══════════
  { uid: "282994", name: "泠鸢yousa", note: "独立音乐人 / 歌势" },
  { uid: "401315430", name: "星瞳", note: "腾讯 CDD" },
  { uid: "1265680561", name: "永雏塔菲", note: "个人势" },
  { uid: "1437582453", name: "東雪蓮Official", note: "个人势" },
  { uid: "420556137", name: "冰糖IO", note: "超电VUP" },
  { uid: "13518461", name: "扇宝", note: "歌势" },
  { uid: "1264109436", name: "明前奶绿", note: "个人势" },
  { uid: "661969", name: "hanser", note: "唱见 / 配音" },

  // ═══════════ 国V 歌势 / 杂谈 ═══════════
  { uid: "1950658", name: "早稻叽", note: "歌势" },
  { uid: "698029620", name: "兰音Reine", note: "歌势" },
  { uid: "6853407", name: "花花Haya", note: "歌势" },
  { uid: "3914187", name: "梦音茶糯", note: "歌势" },
  { uid: "3224926", name: "艾露露Ailurus", note: "歌势" },
  { uid: "4093397", name: "小柔Channel", note: "虚研社" },
  { uid: "829252", name: "黎歌Neeko", note: "歌势" },
  { uid: "4374154", name: "东爱璃Lovely", note: "歌势" },
  { uid: "1160791277", name: "露米Lumi_Official", note: "歌势" },
  { uid: "12004419", name: "折原露露", note: "个人势" },
  { uid: "391703", name: "雪狐桑", note: "个人势" },
  { uid: "347260", name: "穆小泠", note: "歌势" },
  { uid: "1500654", name: "黑泽诺亚NOIR", note: "幻想社" },
  { uid: "2740005", name: "绮良Kira", note: "个人势" },

  // ═══════════ 日V（在B站活跃） ═══════════
  { uid: "1891501", name: "神楽七奈Official", note: "日V 狗妈" },
  { uid: "380829248", name: "花园Serena", note: "日V 猫猫" },
  { uid: "316381099", name: "鹿乃ちゃん", note: "日V 唱见" },
  { uid: "689414", name: "雫るる_Official", note: "日V lulu" },
  { uid: "508963009", name: "HiiroVTuber", note: "日V 猫猫" },
  { uid: "349991143", name: "神楽Mea_Official", note: "日V" },
  { uid: "480680643", name: "眞白花音_Official", note: "日V 白菜" },
  { uid: "1480460", name: "猫芒Bell", note: "日V" },
  { uid: "407106379", name: "绯赤艾莉欧_NHOTBOT", note: "日V 团长" },
  { uid: "697091119", name: "猫雷NyaRu_Official", note: "日V" },
];
