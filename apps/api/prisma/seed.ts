import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WORK_TYPES = [
  { name: 'Кладка перегородок', code: 'WALLS', defaultUnit: 'м³' },
  { name: 'Монтаж опалубки', code: 'FORMWORK', defaultUnit: 'м²' },
  { name: 'Армирование', code: 'REBAR', defaultUnit: 'т' },
  { name: 'Бетонирование', code: 'CONCRETE', defaultUnit: 'м³' },
  { name: 'Гидроизоляция', code: 'WATERPROOF', defaultUnit: 'м²' },
  { name: 'Штукатурные работы', code: 'PLASTER', defaultUnit: 'м²' },
  { name: 'Монтаж инженерных сетей', code: 'MEP', defaultUnit: 'п.м.' },
  { name: 'Земляные работы', code: 'EARTH', defaultUnit: 'м³' },
  { name: 'Монтаж кровли', code: 'ROOF', defaultUnit: 'м²' },
  { name: 'Устройство стяжки', code: 'SCREED', defaultUnit: 'м²' },
  { name: 'Малярные работы', code: 'PAINT', defaultUnit: 'м²' },
  { name: 'Монтаж оконных блоков', code: 'WINDOWS', defaultUnit: 'шт' },
];

const SITES = [
  { name: 'ЖК «Северный»', address: 'г. Москва, ул. Полярная, 12' },
  { name: 'Бизнес-центр «Вектор»', address: 'г. Санкт-Петербург, наб. Финская, 3' },
  { name: 'Складской комплекс «Логистик»', address: 'МО, г. Подольск, промзона' },
];

const EMPLOYEES = [
  { fullName: 'Иванов Иван Иванович', position: 'бригадир' },
  { fullName: 'Петров Пётр Петрович', position: 'бригадир' },
  { fullName: 'Сидоров Алексей Николаевич', position: 'рабочий' },
  { fullName: 'Козлов Дмитрий Сергеевич', position: 'рабочий' },
  { fullName: 'Морозова Анна Викторовна', position: 'рабочий' },
  { fullName: 'Волков Сергей Александрович', position: 'рабочий' },
];

async function main() {
  for (const wt of WORK_TYPES) {
    const existing = await prisma.workType.findFirst({
      where: { OR: [{ code: wt.code }, { name: wt.name }] },
    });
    if (existing) {
      await prisma.workType.update({
        where: { id: existing.id },
        data: {
          name: wt.name,
          code: wt.code,
          defaultUnit: wt.defaultUnit,
          isActive: true,
        },
      });
    } else {
      await prisma.workType.create({
        data: {
          name: wt.name,
          code: wt.code,
          defaultUnit: wt.defaultUnit,
          isActive: true,
        },
      });
    }
  }

  for (const site of SITES) {
    const existing = await prisma.constructionSite.findFirst({
      where: { name: site.name },
    });
    if (!existing) {
      await prisma.constructionSite.create({ data: site });
    }
  }

  for (const emp of EMPLOYEES) {
    const existing = await prisma.employee.findFirst({
      where: { fullName: emp.fullName },
    });
    if (!existing) {
      await prisma.employee.create({ data: emp });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
