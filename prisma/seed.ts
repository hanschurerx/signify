import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 清除现有数据
  await prisma.product.deleteMany();

  // 创建广告横幅产品
  await prisma.product.create({
    data: {
      title: "13盎司乙烯基广告横幅",
      description:
        "专业级13盎司乙烯基材料制作，适合室内外使用，防水防晒，色彩鲜艳持久。适用于店面广告、展会展示、户外活动等场景。",
      price: 29.99,
      mediaType: "vinyl-banner",
      category: "banners",
      imageUrl: "https://placehold.co/600x400?text=Vinyl+Banner",
      featured: true,
      sizes: [
        { id: "2x4", name: "2' x 4'", price: 29.99 },
        { id: "3x6", name: "3' x 6'", price: 49.99 },
        { id: "4x8", name: "4' x 8'", price: 79.99 },
        { id: "custom", name: "自定义尺寸", price: 6.99 },
      ],
      finishOptions: [
        { id: "hemmed", name: "卷边", price: 0 },
        { id: "grommets", name: "带孔", price: 5 },
        { id: "pole-pocket", name: "杆袋", price: 10 },
      ],
    },
  });

  // 创建展示架产品
  await prisma.product.create({
    data: {
      title: "可伸缩铝合金展示架",
      description:
        "高品质铝合金材质，轻便易携，快速组装，适合展会、零售店等场景使用。包含便携收纳包，安装简单，可重复使用。",
      price: 89.99,
      mediaType: "banner-stand",
      category: "displays",
      imageUrl: "https://placehold.co/600x400?text=Banner+Stand",
      featured: true,
      sizes: [
        { id: "24x63", name: '24" x 63"', price: 89.99 },
        { id: "33x78", name: '33" x 78"', price: 119.99 },
        { id: "36x86", name: '36" x 86"', price: 149.99 },
      ],
      finishOptions: [
        { id: "single", name: "单面打印", price: 0 },
        { id: "double", name: "双面打印", price: 50 },
      ],
    },
  });

  console.log("数据库种子数据创建完成");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
