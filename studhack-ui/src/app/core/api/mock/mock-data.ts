import {
  type DictionariesDto,
  type EducationDegree,
  type EventFormat,
  type EventType,
  type SkillExperienceLevel,
  type TeamRequestStatus,
  type TeamRequestType,
  type Timestamp,
  type UUID,
} from '../api.models';

interface MockUserSkillEntity {
  skillId: UUID;
  experienceLevel: SkillExperienceLevel;
}

interface MockPortfolioLinkEntity {
  id: UUID;
  url: string;
  description?: string | null;
}

interface MockEducationEntity {
  id: UUID;
  universityId: UUID;
  degree: EducationDegree;
  faculty?: string | null;
  program?: string | null;
  yearStart?: number | null;
  yearEnd?: number | null;
}

export interface MockPendingCurrentUserEntity {
  id: UUID | null;
  uniqueName?: string | null;
  displayName?: string | null;
  birthDate?: string | null;
  available: boolean;
  cityOfResidenceId?: UUID | null;
  email?: string | null;
  biography?: string | null;
  avatarUrl?: string | null;
  specializationIds: UUID[];
  skillIds: UUID[];
  portfolioLinks: MockPortfolioLinkEntity[];
  educations: MockEducationEntity[];
}

export interface MockUserEntity {
  id: UUID;
  uniqueName: string;
  displayName: string;
  birthDate?: string | null;
  available: boolean;
  cityOfResidenceId?: UUID | null;
  email?: string | null;
  biography?: string | null;
  avatarUrl?: string | null;
  specializationIds: UUID[];
  skills: MockUserSkillEntity[];
  portfolioLinks: MockPortfolioLinkEntity[];
  educations: MockEducationEntity[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MockEventStageEntity {
  id: UUID;
  code: string;
  title: string;
  description?: string | null;
  startsAt?: Timestamp | null;
  endsAt?: Timestamp | null;
  order: number;
}

export interface MockMandatoryPositionEntity {
  id: UUID;
  title: string;
  specializationId: UUID;
  requiredSkillIds: UUID[];
}

interface MockHackathonEntity {
  minTeamSize: number;
  maxTeamSize: number;
  mandatoryPositions: MockMandatoryPositionEntity[];
}

interface MockEventSubscriptionEntity {
  userId: UUID;
  subscribedAt: Timestamp;
}

export interface MockEventEntity {
  id: UUID;
  name: string;
  type: EventType;
  description?: string | null;
  registrationLink?: string | null;
  location: {
    format: EventFormat;
    cityId?: UUID | null;
    addressText?: string | null;
    venueName?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  startsAt: Timestamp;
  endsAt: Timestamp;
  stages: MockEventStageEntity[];
  hackathon?: MockHackathonEntity | null;
  subscriptions: MockEventSubscriptionEntity[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MockTeamPositionEntity {
  id: UUID;
  title: string;
  description?: string | null;
  specializationId: UUID;
  requiredSkillIds: UUID[];
  mandatoryPositionId?: UUID | null;
  isMandatory: boolean;
  filledByExternal: boolean;
  userId?: UUID | null;
}

export interface MockTeamEntity {
  id: UUID;
  eventId: UUID;
  name: string;
  description?: string | null;
  creatorUserId: UUID;
  captainUserId?: UUID | null;
  positions: MockTeamPositionEntity[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MockTeamRequestEntity {
  id: UUID;
  type: TeamRequestType;
  status: TeamRequestStatus;
  message?: string | null;
  userId: UUID;
  createdByUserId: UUID;
  teamId: UUID;
  teamPositionId: UUID;
  createdAt: Timestamp;
  resolvedAt?: Timestamp | null;
}

export interface MockDatabaseState {
  meUserId: UUID;
  currentUserId: UUID | null;
  pendingCurrentUser: MockPendingCurrentUserEntity;
  dictionaries: DictionariesDto;
  users: MockUserEntity[];
  events: MockEventEntity[];
  teams: MockTeamEntity[];
  teamRequests: MockTeamRequestEntity[];
}

const REGION_IDS = {
  moscow: 'region-moscow',
  saintPetersburg: 'region-saint-petersburg',
  tatarstan: 'region-tatarstan',
  novosibirsk: 'region-novosibirsk',
  sverdlovsk: 'region-sverdlovsk',
  tomsk: 'region-tomsk',
  samara: 'region-samara',
} as const;

const CITY_IDS = {
  moscow: 'city-moscow',
  zelenograd: 'city-zelenograd',
  saintPetersburg: 'city-saint-petersburg',
  innopolis: 'city-innopolis',
  kazan: 'city-kazan',
  novosibirsk: 'city-novosibirsk',
  yekaterinburg: 'city-yekaterinburg',
  tomsk: 'city-tomsk',
  samara: 'city-samara',
} as const;

const UNIVERSITY_IDS = {
  hse: 'university-hse',
  mipt: 'university-mipt',
  bauman: 'university-bauman',
  itmo: 'university-itmo',
  innopolis: 'university-innopolis',
  urfu: 'university-urfu',
  nsu: 'university-nsu',
  tsu: 'university-tsu',
  samara: 'university-samara',
} as const;

const SPECIALIZATION_IDS = {
  frontend: 'specialization-frontend',
  backend: 'specialization-backend',
  mobile: 'specialization-mobile',
  data: 'specialization-data',
  ml: 'specialization-ml',
  design: 'specialization-design',
  product: 'specialization-product',
  devops: 'specialization-devops',
  qa: 'specialization-qa',
  analytics: 'specialization-analytics',
} as const;

const SKILL_IDS = {
  angular: 'skill-angular',
  react: 'skill-react',
  typescript: 'skill-typescript',
  rxjs: 'skill-rxjs',
  node: 'skill-node',
  nest: 'skill-nest',
  postgresql: 'skill-postgresql',
  python: 'skill-python',
  fastapi: 'skill-fastapi',
  pytorch: 'skill-pytorch',
  mlops: 'skill-mlops',
  sql: 'skill-sql',
  powerbi: 'skill-powerbi',
  figma: 'skill-figma',
  uxResearch: 'skill-ux-research',
  productDiscovery: 'skill-product-discovery',
  docker: 'skill-docker',
  kubernetes: 'skill-kubernetes',
  maplibre: 'skill-maplibre',
  flutter: 'skill-flutter',
  swift: 'skill-swift',
  qaAutomation: 'skill-qa-automation',
  cypress: 'skill-cypress',
  kafka: 'skill-kafka',
  go: 'skill-go',
  computerVision: 'skill-computer-vision',
} as const;

const USER_IDS = {
  egor: 'user-egor-smirnov',
  alina: 'user-alina-morozova',
  daniil: 'user-daniil-ivanov',
  maria: 'user-maria-belova',
  roman: 'user-roman-karasev',
  sofia: 'user-sofia-lebedeva',
  lev: 'user-lev-grinberg',
  anastasia: 'user-anastasia-kim',
  timur: 'user-timur-yusupov',
  ksenia: 'user-ksenia-volkova',
  artem: 'user-artem-bykov',
  elizaveta: 'user-elizaveta-romanova',
  nikita: 'user-nikita-safronov',
  polina: 'user-polina-sergeeva',
  viktor: 'user-viktor-pak',
  yana: 'user-yana-dobrynina',
} as const;

const EVENT_IDS = {
  aiProductJam: 'event-ai-product-jam-2026',
  smartCity: 'event-smart-city-sprint-2026',
  fintechDesign: 'event-fintech-design-challenge-2026',
  careerNight: 'event-career-night-2026',
} as const;

const TEAM_IDS = {
  neonWave: 'team-neon-wave',
  tensorCats: 'team-tensor-cats',
  latencyZero: 'team-latency-zero',
  urbanPulse: 'team-urban-pulse',
  routeScout: 'team-route-scout',
  citySense: 'team-city-sense',
  liquidSignals: 'team-liquid-signals',
  ledgerLab: 'team-ledger-lab',
} as const;

const timestamp = (value: string): Timestamp => value;

const avatarUrl = (seed: string): string =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;

const regions = [
  { id: REGION_IDS.moscow, name: 'Москва' },
  { id: REGION_IDS.saintPetersburg, name: 'Санкт-Петербург' },
  { id: REGION_IDS.tatarstan, name: 'Республика Татарстан' },
  { id: REGION_IDS.novosibirsk, name: 'Новосибирская область' },
  { id: REGION_IDS.sverdlovsk, name: 'Свердловская область' },
  { id: REGION_IDS.tomsk, name: 'Томская область' },
  { id: REGION_IDS.samara, name: 'Самарская область' },
] as const;

const cities = [
  { id: CITY_IDS.moscow, name: 'Москва', regionId: REGION_IDS.moscow },
  { id: CITY_IDS.zelenograd, name: 'Зеленоград', regionId: REGION_IDS.moscow },
  {
    id: CITY_IDS.saintPetersburg,
    name: 'Санкт-Петербург',
    regionId: REGION_IDS.saintPetersburg,
  },
  { id: CITY_IDS.innopolis, name: 'Иннополис', regionId: REGION_IDS.tatarstan },
  { id: CITY_IDS.kazan, name: 'Казань', regionId: REGION_IDS.tatarstan },
  {
    id: CITY_IDS.novosibirsk,
    name: 'Новосибирск',
    regionId: REGION_IDS.novosibirsk,
  },
  {
    id: CITY_IDS.yekaterinburg,
    name: 'Екатеринбург',
    regionId: REGION_IDS.sverdlovsk,
  },
  { id: CITY_IDS.tomsk, name: 'Томск', regionId: REGION_IDS.tomsk },
  { id: CITY_IDS.samara, name: 'Самара', regionId: REGION_IDS.samara },
] as const;

const universities = [
  {
    id: UNIVERSITY_IDS.hse,
    name: 'НИУ ВШЭ',
    cityId: CITY_IDS.moscow,
  },
  {
    id: UNIVERSITY_IDS.mipt,
    name: 'МФТИ',
    cityId: CITY_IDS.zelenograd,
  },
  {
    id: UNIVERSITY_IDS.bauman,
    name: 'МГТУ им. Баумана',
    cityId: CITY_IDS.moscow,
  },
  {
    id: UNIVERSITY_IDS.itmo,
    name: 'ИТМО',
    cityId: CITY_IDS.saintPetersburg,
  },
  {
    id: UNIVERSITY_IDS.innopolis,
    name: 'Университет Иннополис',
    cityId: CITY_IDS.innopolis,
  },
  {
    id: UNIVERSITY_IDS.urfu,
    name: 'УрФУ',
    cityId: CITY_IDS.yekaterinburg,
  },
  {
    id: UNIVERSITY_IDS.nsu,
    name: 'НГУ',
    cityId: CITY_IDS.novosibirsk,
  },
  {
    id: UNIVERSITY_IDS.tsu,
    name: 'ТГУ',
    cityId: CITY_IDS.tomsk,
  },
  {
    id: UNIVERSITY_IDS.samara,
    name: 'Самарский университет',
    cityId: CITY_IDS.samara,
  },
] as const;

const specializations = [
  { id: SPECIALIZATION_IDS.frontend, name: 'Фронтенд' },
  { id: SPECIALIZATION_IDS.backend, name: 'Бэкенд' },
  { id: SPECIALIZATION_IDS.mobile, name: 'Мобильная разработка' },
  { id: SPECIALIZATION_IDS.data, name: 'Big Data' },
  { id: SPECIALIZATION_IDS.ml, name: 'Машинное обучение' },
  { id: SPECIALIZATION_IDS.design, name: 'Дизайн' },
  { id: SPECIALIZATION_IDS.product, name: 'Продукт' },
  { id: SPECIALIZATION_IDS.devops, name: 'DevOps' },
  { id: SPECIALIZATION_IDS.qa, name: 'Тестирование' },
  { id: SPECIALIZATION_IDS.analytics, name: 'Аналитика' },
] as const;

const skills = [
  { id: SKILL_IDS.angular, name: 'Angular' },
  { id: SKILL_IDS.react, name: 'React' },
  { id: SKILL_IDS.typescript, name: 'TypeScript' },
  { id: SKILL_IDS.rxjs, name: 'RxJS' },
  { id: SKILL_IDS.node, name: 'Node.js' },
  { id: SKILL_IDS.nest, name: 'NestJS' },
  { id: SKILL_IDS.postgresql, name: 'PostgreSQL' },
  { id: SKILL_IDS.python, name: 'Python' },
  { id: SKILL_IDS.fastapi, name: 'FastAPI' },
  { id: SKILL_IDS.pytorch, name: 'PyTorch' },
  { id: SKILL_IDS.mlops, name: 'MLOps' },
  { id: SKILL_IDS.sql, name: 'SQL' },
  { id: SKILL_IDS.powerbi, name: 'Power BI' },
  { id: SKILL_IDS.figma, name: 'Figma' },
  { id: SKILL_IDS.uxResearch, name: 'UX Research' },
  { id: SKILL_IDS.productDiscovery, name: 'Product Discovery' },
  { id: SKILL_IDS.docker, name: 'Docker' },
  { id: SKILL_IDS.kubernetes, name: 'Kubernetes' },
  { id: SKILL_IDS.maplibre, name: 'MapLibre / GIS' },
  { id: SKILL_IDS.flutter, name: 'Flutter' },
  { id: SKILL_IDS.swift, name: 'Swift' },
  { id: SKILL_IDS.qaAutomation, name: 'QA Automation' },
  { id: SKILL_IDS.cypress, name: 'Cypress' },
  { id: SKILL_IDS.kafka, name: 'Kafka' },
  { id: SKILL_IDS.go, name: 'Go' },
  { id: SKILL_IDS.computerVision, name: 'Computer Vision' },
] as const;

const regionMap = new Map(regions.map((region) => [region.id, region]));
const cityMap = new Map(
  cities.map((city) => [
    city.id,
    {
      id: city.id,
      name: city.name,
      region: regionMap.get(city.regionId)!,
    },
  ]),
);
const dictionaries: DictionariesDto = {
  regions: regions.map((region) => ({ ...region })),
  cities: cities.map((city) => cityMap.get(city.id)!),
  universities: universities.map((university) => ({
    id: university.id,
    name: university.name,
    city: cityMap.get(university.cityId)!,
  })),
  specializations: specializations.map((specialization) => ({ ...specialization })),
  skills: skills.map((skill) => ({ ...skill })),
};

const link = (
  id: string,
  url: string,
  description?: string | null,
): MockPortfolioLinkEntity => ({
  id,
  url,
  description,
});

const education = (
  id: string,
  universityId: UUID,
  degree: EducationDegree,
  faculty?: string | null,
  program?: string | null,
  yearStart?: number | null,
  yearEnd?: number | null,
): MockEducationEntity => ({
  id,
  universityId,
  degree,
  faculty,
  program,
  yearStart,
  yearEnd,
});

const user = (
  entity: Omit<MockUserEntity, 'avatarUrl'> & { avatarSeed: string },
): MockUserEntity => {
  const { avatarSeed, ...rest } = entity;

  return {
    ...rest,
    avatarUrl: avatarUrl(avatarSeed),
  };
};

const users: MockUserEntity[] = [
  user({
    id: USER_IDS.egor,
    avatarSeed: 'egor',
    uniqueName: 'egor.smirnov',
    displayName: 'Егор Смирнов',
    birthDate: '2001-08-14',
    available: true,
    cityOfResidenceId: CITY_IDS.moscow,
    email: 'egor@studhack.dev',
    biography:
      'Frontend-инженер с сильной продуктовой насмотренностью. Любит собирать понятные интерфейсы для сложных сценариев и быстро поднимать clickable MVP.',
    specializationIds: [SPECIALIZATION_IDS.frontend, SPECIALIZATION_IDS.product],
    skills: [
      { skillId: SKILL_IDS.angular, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.typescript, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.rxjs, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.figma, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.productDiscovery, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-egor-ui',
        'https://github.com/egor-smirnov/studhack-ui-kit',
        'UI-kit для учебных хакатонов на Angular и Taiga UI',
      ),
      link(
        'portfolio-egor-demo',
        'https://egor-smirnov.notion.site/hackathon-casebook',
        'Короткие разборы 12 хакатонных кейсов с MVP и метриками',
      ),
    ],
    educations: [
      education(
        'education-egor-hse',
        UNIVERSITY_IDS.hse,
        'bachelor',
        'Факультет компьютерных наук',
        'Программная инженерия',
        2019,
        2023,
      ),
    ],
    createdAt: timestamp('2024-09-01T10:00:00Z'),
    updatedAt: timestamp('2026-03-18T11:40:00Z'),
  }),
  user({
    id: USER_IDS.alina,
    avatarSeed: 'alina',
    uniqueName: 'alina.morozova',
    displayName: 'Алина Морозова',
    birthDate: '2000-03-10',
    available: true,
    cityOfResidenceId: CITY_IDS.saintPetersburg,
    email: 'alina@studhack.dev',
    biography:
      'Backend-разработчица, которая любит понятные контракты, событийную интеграцию и собранные SQL-схемы без магии.',
    specializationIds: [SPECIALIZATION_IDS.backend, SPECIALIZATION_IDS.devops],
    skills: [
      { skillId: SKILL_IDS.node, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.nest, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.postgresql, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.kafka, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.docker, experienceLevel: 'senior' },
    ],
    portfolioLinks: [
      link(
        'portfolio-alina-api',
        'https://github.com/alina-morozova/highload-hack-api',
        'Скелет backend-платформы для многокомандных хакатонов',
      ),
      link(
        'portfolio-alina-arch',
        'https://alina-morozova.notion.site/event-driven-playbook',
        'Playbook по event-driven интеграциям для B2B-продуктов',
      ),
    ],
    educations: [
      education(
        'education-alina-itmo',
        UNIVERSITY_IDS.itmo,
        'master',
        'Факультет программной инженерии',
        'Распределенные системы',
        2022,
        2024,
      ),
      education(
        'education-alina-itmo-bachelor',
        UNIVERSITY_IDS.itmo,
        'bachelor',
        'Факультет информационных технологий',
        'Инженерия ПО',
        2018,
        2022,
      ),
    ],
    createdAt: timestamp('2024-07-11T08:20:00Z'),
    updatedAt: timestamp('2026-03-12T09:15:00Z'),
  }),
  user({
    id: USER_IDS.daniil,
    avatarSeed: 'daniil',
    uniqueName: 'daniil.ivanov',
    displayName: 'Даниил Иванов',
    birthDate: '1999-12-05',
    available: true,
    cityOfResidenceId: CITY_IDS.novosibirsk,
    email: 'daniil@studhack.dev',
    biography:
      'ML-инженер. Берет на себя полный цикл от подготовки датасета до inference-пайплайна и быстрой проверки гипотез.',
    specializationIds: [SPECIALIZATION_IDS.ml, SPECIALIZATION_IDS.data],
    skills: [
      { skillId: SKILL_IDS.python, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.pytorch, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.computerVision, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.mlops, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-daniil-cv',
        'https://github.com/daniil-ivanov/cv-demo-stack',
        'Набор baseline-моделей для vision-кейсов на соревнованиях',
      ),
    ],
    educations: [
      education(
        'education-daniil-nsu',
        UNIVERSITY_IDS.nsu,
        'master',
        'Факультет информационных технологий',
        'Applied Machine Learning',
        2022,
        2024,
      ),
    ],
    createdAt: timestamp('2024-05-10T14:25:00Z'),
    updatedAt: timestamp('2026-03-17T06:45:00Z'),
  }),
  user({
    id: USER_IDS.maria,
    avatarSeed: 'maria',
    uniqueName: 'maria.belova',
    displayName: 'Мария Белова',
    birthDate: '2001-01-18',
    available: true,
    cityOfResidenceId: CITY_IDS.kazan,
    email: 'maria@studhack.dev',
    biography:
      'Продуктовый дизайнер. Сильна в быстрых пользовательских интервью, сборке кликабельных прототипов и дизайн-системах под MVP.',
    specializationIds: [SPECIALIZATION_IDS.design, SPECIALIZATION_IDS.product],
    skills: [
      { skillId: SKILL_IDS.figma, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.uxResearch, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.productDiscovery, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-maria-casebook',
        'https://maria-belova.notion.site/design-casebook',
        'Портфолио кейсов по edtech, fintech и civic tech продуктам',
      ),
      link(
        'portfolio-maria-figma',
        'https://www.figma.com/@mariabelova',
        'Публичные прототипы интерфейсов и UI-исследования',
      ),
    ],
    educations: [
      education(
        'education-maria-innopolis',
        UNIVERSITY_IDS.innopolis,
        'bachelor',
        'Институт дизайна',
        'Human-Computer Interaction',
        2019,
        2023,
      ),
    ],
    createdAt: timestamp('2024-04-14T09:00:00Z'),
    updatedAt: timestamp('2026-03-15T12:00:00Z'),
  }),
  user({
    id: USER_IDS.roman,
    avatarSeed: 'roman',
    uniqueName: 'roman.karasev',
    displayName: 'Роман Карасев',
    birthDate: '1998-06-29',
    available: false,
    cityOfResidenceId: CITY_IDS.yekaterinburg,
    email: 'roman@studhack.dev',
    biography:
      'Прагматичный backend/devops инженер. Лучше всего чувствует себя в командах, где нужно быстро развернуть надежный контур данных и инфраструктуры.',
    specializationIds: [SPECIALIZATION_IDS.backend, SPECIALIZATION_IDS.devops],
    skills: [
      { skillId: SKILL_IDS.go, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.postgresql, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.docker, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.kubernetes, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.kafka, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-roman-infra',
        'https://github.com/roman-karasev/platform-ops',
        'Шаблоны деплоя и observability для командных MVP',
      ),
    ],
    educations: [
      education(
        'education-roman-urfu',
        UNIVERSITY_IDS.urfu,
        'specialist',
        'Институт радиоэлектроники',
        'Информационные системы',
        2016,
        2021,
      ),
    ],
    createdAt: timestamp('2024-02-01T07:30:00Z'),
    updatedAt: timestamp('2026-03-01T10:30:00Z'),
  }),
  user({
    id: USER_IDS.sofia,
    avatarSeed: 'sofia',
    uniqueName: 'sofia.lebedeva',
    displayName: 'Софья Лебедева',
    birthDate: '2002-07-07',
    available: true,
    cityOfResidenceId: CITY_IDS.moscow,
    email: 'sofia@studhack.dev',
    biography:
      'PM с уклоном в data-informed discovery. Умеет быстро разложить кейс по гипотезам, метрикам и поставить команду в ритм.',
    specializationIds: [SPECIALIZATION_IDS.product, SPECIALIZATION_IDS.analytics],
    skills: [
      { skillId: SKILL_IDS.productDiscovery, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.powerbi, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.uxResearch, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-sofia-playbook',
        'https://sofia-lebedeva.notion.site/growth-playbook',
        'Playbook по discovery и scoring хакатонных гипотез',
      ),
    ],
    educations: [
      education(
        'education-sofia-hse',
        UNIVERSITY_IDS.hse,
        'bachelor',
        'Факультет бизнеса и менеджмента',
        'Управление продуктом',
        2020,
        2024,
      ),
    ],
    createdAt: timestamp('2024-05-21T16:00:00Z'),
    updatedAt: timestamp('2026-03-16T08:55:00Z'),
  }),
  user({
    id: USER_IDS.lev,
    avatarSeed: 'lev',
    uniqueName: 'lev.grinberg',
    displayName: 'Лев Гринберг',
    birthDate: '1999-02-14',
    available: true,
    cityOfResidenceId: CITY_IDS.innopolis,
    email: 'lev@studhack.dev',
    biography:
      'Full-stack инженер, чаще всего закрывает backend и мобильные интеграции. Хорошо чувствует системный дизайн и edge-кейсы.',
    specializationIds: [SPECIALIZATION_IDS.backend, SPECIALIZATION_IDS.mobile],
    skills: [
      { skillId: SKILL_IDS.node, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.fastapi, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.flutter, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.swift, experienceLevel: 'junior' },
      { skillId: SKILL_IDS.postgresql, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-lev-mobile',
        'https://github.com/lev-grinberg/city-mobile-stack',
        'Набор мобильных шаблонов под городские сервисы',
      ),
    ],
    educations: [
      education(
        'education-lev-innopolis',
        UNIVERSITY_IDS.innopolis,
        'master',
        'Institute of Software Development',
        'Software Engineering',
        2021,
        2023,
      ),
    ],
    createdAt: timestamp('2024-06-11T11:00:00Z'),
    updatedAt: timestamp('2026-03-19T07:45:00Z'),
  }),
  user({
    id: USER_IDS.anastasia,
    avatarSeed: 'anastasia',
    uniqueName: 'anastasia.kim',
    displayName: 'Анастасия Ким',
    birthDate: '2000-10-03',
    available: true,
    cityOfResidenceId: CITY_IDS.samara,
    email: 'anastasia@studhack.dev',
    biography:
      'QA и аналитик в одном лице. Любит собирать мониторинг, сценарии тестирования и сразу привязывать их к продуктовым метрикам.',
    specializationIds: [SPECIALIZATION_IDS.qa, SPECIALIZATION_IDS.analytics],
    skills: [
      { skillId: SKILL_IDS.qaAutomation, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.cypress, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.powerbi, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-anastasia-quality',
        'https://github.com/anastasia-kim/quality-ops',
        'Шаблоны quality gates и dashboard для MVP-команд',
      ),
    ],
    educations: [
      education(
        'education-anastasia-samara',
        UNIVERSITY_IDS.samara,
        'bachelor',
        'Институт информатики',
        'Прикладная математика и информатика',
        2018,
        2022,
      ),
    ],
    createdAt: timestamp('2024-08-02T12:10:00Z'),
    updatedAt: timestamp('2026-03-14T15:10:00Z'),
  }),
  user({
    id: USER_IDS.timur,
    avatarSeed: 'timur',
    uniqueName: 'timur.yusupov',
    displayName: 'Тимур Юсупов',
    birthDate: '2001-04-26',
    available: true,
    cityOfResidenceId: CITY_IDS.kazan,
    email: 'timur@studhack.dev',
    biography:
      'Frontend-разработчик с упором в perf и сложные UI-структуры. Нравится разбирать графики, real-time сценарии и карты.',
    specializationIds: [SPECIALIZATION_IDS.frontend, SPECIALIZATION_IDS.mobile],
    skills: [
      { skillId: SKILL_IDS.react, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.typescript, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.maplibre, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.flutter, experienceLevel: 'junior' },
    ],
    portfolioLinks: [
      link(
        'portfolio-timur-maps',
        'https://github.com/timur-yusupov/realtime-city-map',
        'Демо realtime-карт и сложных фильтров для smart city продуктов',
      ),
    ],
    educations: [
      education(
        'education-timur-innopolis',
        UNIVERSITY_IDS.innopolis,
        'bachelor',
        'Institute of Computer Science',
        'Computer Science',
        2020,
        2024,
      ),
    ],
    createdAt: timestamp('2024-06-20T10:15:00Z'),
    updatedAt: timestamp('2026-03-12T13:10:00Z'),
  }),
  user({
    id: USER_IDS.ksenia,
    avatarSeed: 'ksenia',
    uniqueName: 'ksenia.volkova',
    displayName: 'Ксения Волкова',
    birthDate: '1999-11-12',
    available: false,
    cityOfResidenceId: CITY_IDS.saintPetersburg,
    email: 'ksenia@studhack.dev',
    biography:
      'Lead product designer для сервисов с большой вариативностью сценариев. Сильна в картах, data dense UI и сервисном дизайне.',
    specializationIds: [SPECIALIZATION_IDS.design, SPECIALIZATION_IDS.analytics],
    skills: [
      { skillId: SKILL_IDS.figma, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.uxResearch, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.maplibre, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.productDiscovery, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-ksenia-map',
        'https://www.behance.net/kseniavolkova',
        'Портфолио картографических и fintech интерфейсов',
      ),
    ],
    educations: [
      education(
        'education-ksenia-itmo',
        UNIVERSITY_IDS.itmo,
        'master',
        'Art & Science',
        'UX/UI Design',
        2021,
        2023,
      ),
    ],
    createdAt: timestamp('2024-01-17T08:00:00Z'),
    updatedAt: timestamp('2026-03-10T18:00:00Z'),
  }),
  user({
    id: USER_IDS.artem,
    avatarSeed: 'artem',
    uniqueName: 'artem.bykov',
    displayName: 'Артем Быков',
    birthDate: '1998-09-09',
    available: true,
    cityOfResidenceId: CITY_IDS.tomsk,
    email: 'artem@studhack.dev',
    biography:
      'Backend-инженер. Берет интеграции, стриминг, расчетные контуры и всю неприятную сложность вокруг согласованности данных.',
    specializationIds: [SPECIALIZATION_IDS.backend, SPECIALIZATION_IDS.data],
    skills: [
      { skillId: SKILL_IDS.go, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.postgresql, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.kafka, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.docker, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-artem-streams',
        'https://github.com/artem-bykov/stream-lab',
        'Примеры стриминговых пайплайнов для scoring и antifraud',
      ),
    ],
    educations: [
      education(
        'education-artem-tsu',
        UNIVERSITY_IDS.tsu,
        'specialist',
        'Факультет прикладной математики',
        'Информационные системы',
        2016,
        2021,
      ),
    ],
    createdAt: timestamp('2024-04-02T09:05:00Z'),
    updatedAt: timestamp('2026-03-11T07:10:00Z'),
  }),
  user({
    id: USER_IDS.elizaveta,
    avatarSeed: 'elizaveta',
    uniqueName: 'elizaveta.romanova',
    displayName: 'Елизавета Романова',
    birthDate: '2000-05-31',
    available: true,
    cityOfResidenceId: CITY_IDS.novosibirsk,
    email: 'elizaveta@studhack.dev',
    biography:
      'Data scientist, которая любит табличные кейсы, ranker-модели и продуманную валидацию. Хорошо держит баланс между точностью и скоростью.',
    specializationIds: [SPECIALIZATION_IDS.ml, SPECIALIZATION_IDS.analytics],
    skills: [
      { skillId: SKILL_IDS.python, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.pytorch, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.powerbi, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-elizaveta-ranking',
        'https://github.com/elizaveta-romanova/ranking-hacks',
        'Набор baseline-моделей для ranking и scoring задач',
      ),
    ],
    educations: [
      education(
        'education-elizaveta-nsu',
        UNIVERSITY_IDS.nsu,
        'bachelor',
        'Факультет информационных технологий',
        'Data Science',
        2018,
        2022,
      ),
    ],
    createdAt: timestamp('2024-03-03T12:00:00Z'),
    updatedAt: timestamp('2026-03-09T09:40:00Z'),
  }),
  user({
    id: USER_IDS.nikita,
    avatarSeed: 'nikita',
    uniqueName: 'nikita.safronov',
    displayName: 'Никита Сафронов',
    birthDate: '2002-02-02',
    available: true,
    cityOfResidenceId: CITY_IDS.moscow,
    email: 'nikita@studhack.dev',
    biography:
      'Frontend/mobile инженер. Сильнее всего в быстрых промо-потоках, мобильных интеграциях и аккуратной адаптивной верстке.',
    specializationIds: [SPECIALIZATION_IDS.frontend, SPECIALIZATION_IDS.mobile],
    skills: [
      { skillId: SKILL_IDS.angular, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.react, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.typescript, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.flutter, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-nikita-mobile',
        'https://github.com/nikita-safronov/mobile-hack-kit',
        'Мобильные заготовки под MVP-команды и внутренние демо',
      ),
    ],
    educations: [
      education(
        'education-nikita-bauman',
        UNIVERSITY_IDS.bauman,
        'bachelor',
        'Информатика и системы управления',
        'Программная инженерия',
        2020,
        2024,
      ),
    ],
    createdAt: timestamp('2024-09-15T14:45:00Z'),
    updatedAt: timestamp('2026-03-08T08:15:00Z'),
  }),
  user({
    id: USER_IDS.polina,
    avatarSeed: 'polina',
    uniqueName: 'polina.sergeeva',
    displayName: 'Полина Сергеева',
    birthDate: '2001-12-20',
    available: true,
    cityOfResidenceId: CITY_IDS.saintPetersburg,
    email: 'polina@studhack.dev',
    biography:
      'Product manager с сильной аналитической базой. Умеет собрать внятный roadmap прямо по ходу хакатона и удержать фокус команды.',
    specializationIds: [SPECIALIZATION_IDS.product, SPECIALIZATION_IDS.analytics],
    skills: [
      { skillId: SKILL_IDS.productDiscovery, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.powerbi, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.uxResearch, experienceLevel: 'middle' },
    ],
    portfolioLinks: [
      link(
        'portfolio-polina-product',
        'https://polina-sergeeva.notion.site/product-cases',
        'Набор product-кейсов по civic tech и fintech',
      ),
    ],
    educations: [
      education(
        'education-polina-itmo',
        UNIVERSITY_IDS.itmo,
        'bachelor',
        'Факультет технологического менеджмента',
        'Product Analytics',
        2019,
        2023,
      ),
    ],
    createdAt: timestamp('2024-04-10T15:30:00Z'),
    updatedAt: timestamp('2026-03-18T09:05:00Z'),
  }),
  user({
    id: USER_IDS.viktor,
    avatarSeed: 'viktor',
    uniqueName: 'viktor.pak',
    displayName: 'Виктор Пак',
    birthDate: '2002-03-13',
    available: true,
    cityOfResidenceId: CITY_IDS.tomsk,
    email: 'viktor@studhack.dev',
    biography:
      'Начинающий data engineer. Сильнее всего в Python, ETL и быстрой чистке сырых данных под аналитику.',
    specializationIds: [SPECIALIZATION_IDS.data, SPECIALIZATION_IDS.backend],
    skills: [
      { skillId: SKILL_IDS.python, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.sql, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.fastapi, experienceLevel: 'junior' },
    ],
    portfolioLinks: [
      link(
        'portfolio-viktor-etl',
        'https://github.com/viktor-pak/etl-playground',
        'Небольшие ETL-пайплайны и задачи по очистке данных',
      ),
    ],
    educations: [
      education(
        'education-viktor-tsu',
        UNIVERSITY_IDS.tsu,
        'bachelor',
        'Факультет информатики',
        'Прикладная информатика',
        2021,
        2025,
      ),
    ],
    createdAt: timestamp('2024-10-01T11:20:00Z'),
    updatedAt: timestamp('2026-03-13T10:00:00Z'),
  }),
  user({
    id: USER_IDS.yana,
    avatarSeed: 'yana',
    uniqueName: 'yana.dobrynina',
    displayName: 'Яна Добрынина',
    birthDate: '2001-09-27',
    available: true,
    cityOfResidenceId: CITY_IDS.samara,
    email: 'yana@studhack.dev',
    biography:
      'UX/UI дизайнер. Комфортно работает на ранних стадиях идеи, быстро делает интервью, wireframes и аккуратный визуал.',
    specializationIds: [SPECIALIZATION_IDS.design, SPECIALIZATION_IDS.frontend],
    skills: [
      { skillId: SKILL_IDS.figma, experienceLevel: 'senior' },
      { skillId: SKILL_IDS.uxResearch, experienceLevel: 'middle' },
      { skillId: SKILL_IDS.angular, experienceLevel: 'junior' },
    ],
    portfolioLinks: [
      link(
        'portfolio-yana-ux',
        'https://www.behance.net/yanadobrynina',
        'Интерфейсы для healthtech, fintech и внутренних платформ',
      ),
    ],
    educations: [
      education(
        'education-yana-samara',
        UNIVERSITY_IDS.samara,
        'bachelor',
        'Институт инженерии',
        'Дизайн цифровых продуктов',
        2019,
        2023,
      ),
    ],
    createdAt: timestamp('2024-07-12T09:15:00Z'),
    updatedAt: timestamp('2026-03-19T11:20:00Z'),
  }),
];

const events: MockEventEntity[] = [
  {
    id: EVENT_IDS.aiProductJam,
    name: 'AI Product Jam 2026',
    type: 'hackathon',
    description:
      'Двухдневный хакатон про AI-first продукты. Участники собирают решения для рекомендаций, ассистентов и операционных AI-инструментов.',
    registrationLink: 'https://studhack.dev/events/ai-product-jam-2026',
    location: {
      format: 'hybrid',
      cityId: CITY_IDS.moscow,
      addressText: 'ул. Льва Толстого, 16',
      venueName: 'StudHack Hub',
      latitude: 55.73311,
      longitude: 37.58791,
    },
    startsAt: timestamp('2026-04-18T08:30:00Z'),
    endsAt: timestamp('2026-04-20T17:00:00Z'),
    stages: [
      {
        id: 'stage-ai-registration',
        code: 'registration_deadline',
        title: 'Окончание регистрации',
        startsAt: timestamp('2026-04-12T21:00:00Z'),
        endsAt: timestamp('2026-04-12T21:00:00Z'),
        order: 1,
      },
      {
        id: 'stage-ai-briefing',
        code: 'team_formation',
        title: 'Формирование команд',
        description: 'Последний слот для добора участников в команды.',
        startsAt: timestamp('2026-04-13T09:00:00Z'),
        endsAt: timestamp('2026-04-16T21:00:00Z'),
        order: 2,
      },
      {
        id: 'stage-ai-start',
        code: 'hackathon_start',
        title: 'Старт хакатона',
        startsAt: timestamp('2026-04-18T08:30:00Z'),
        endsAt: timestamp('2026-04-18T09:00:00Z'),
        order: 3,
      },
      {
        id: 'stage-ai-demo',
        code: 'demo_day',
        title: 'Демо и защита',
        startsAt: timestamp('2026-04-20T13:00:00Z'),
        endsAt: timestamp('2026-04-20T17:00:00Z'),
        order: 4,
      },
    ],
    hackathon: {
      minTeamSize: 3,
      maxTeamSize: 6,
      mandatoryPositions: [
        {
          id: 'mandatory-ai-frontend',
          title: 'Frontend Lead',
          specializationId: SPECIALIZATION_IDS.frontend,
          requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript, SKILL_IDS.rxjs],
        },
        {
          id: 'mandatory-ai-backend',
          title: 'Backend Engineer',
          specializationId: SPECIALIZATION_IDS.backend,
          requiredSkillIds: [SKILL_IDS.node, SKILL_IDS.postgresql, SKILL_IDS.docker],
        },
        {
          id: 'mandatory-ai-ml',
          title: 'ML Engineer',
          specializationId: SPECIALIZATION_IDS.ml,
          requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.pytorch, SKILL_IDS.mlops],
        },
      ],
    },
    subscriptions: [
      { userId: USER_IDS.egor, subscribedAt: timestamp('2026-03-03T09:00:00Z') },
      { userId: USER_IDS.alina, subscribedAt: timestamp('2026-03-04T12:15:00Z') },
      { userId: USER_IDS.daniil, subscribedAt: timestamp('2026-03-05T07:20:00Z') },
      { userId: USER_IDS.maria, subscribedAt: timestamp('2026-03-05T08:00:00Z') },
      { userId: USER_IDS.sofia, subscribedAt: timestamp('2026-03-06T13:45:00Z') },
      { userId: USER_IDS.artem, subscribedAt: timestamp('2026-03-07T10:05:00Z') },
      { userId: USER_IDS.yana, subscribedAt: timestamp('2026-03-08T11:30:00Z') },
    ],
    createdAt: timestamp('2026-01-20T08:00:00Z'),
    updatedAt: timestamp('2026-03-18T16:10:00Z'),
  },
  {
    id: EVENT_IDS.smartCity,
    name: 'Smart City Sprint 2026',
    type: 'hackathon',
    description:
      'Хакатон про городские сервисы, навигацию, цифровые двойники и снижение операционных потерь в муниципальных процессах.',
    registrationLink: 'https://studhack.dev/events/smart-city-sprint-2026',
    location: {
      format: 'offline',
      cityId: CITY_IDS.innopolis,
      addressText: 'Университет Иннополис, корпус А',
      venueName: 'Innopolis Arena',
      latitude: 55.751244,
      longitude: 48.744099,
    },
    startsAt: timestamp('2026-05-15T07:00:00Z'),
    endsAt: timestamp('2026-05-17T16:00:00Z'),
    stages: [
      {
        id: 'stage-city-registration',
        code: 'registration_deadline',
        title: 'Окончание регистрации',
        startsAt: timestamp('2026-05-08T20:59:00Z'),
        endsAt: timestamp('2026-05-08T20:59:00Z'),
        order: 1,
      },
      {
        id: 'stage-city-precheck',
        code: 'solution_outline',
        title: 'Пре-чек идей',
        description: 'Команды присылают набросок архитектуры и метрик.',
        startsAt: timestamp('2026-05-10T08:00:00Z'),
        endsAt: timestamp('2026-05-13T18:00:00Z'),
        order: 2,
      },
      {
        id: 'stage-city-start',
        code: 'hackathon_start',
        title: 'Старт спринта',
        startsAt: timestamp('2026-05-15T07:00:00Z'),
        endsAt: timestamp('2026-05-15T07:30:00Z'),
        order: 3,
      },
      {
        id: 'stage-city-final',
        code: 'final',
        title: 'Финал',
        startsAt: timestamp('2026-05-17T13:00:00Z'),
        endsAt: timestamp('2026-05-17T16:00:00Z'),
        order: 4,
      },
    ],
    hackathon: {
      minTeamSize: 4,
      maxTeamSize: 7,
      mandatoryPositions: [
        {
          id: 'mandatory-city-frontend',
          title: 'Frontend / Maps',
          specializationId: SPECIALIZATION_IDS.frontend,
          requiredSkillIds: [SKILL_IDS.react, SKILL_IDS.typescript, SKILL_IDS.maplibre],
        },
        {
          id: 'mandatory-city-backend',
          title: 'Backend Integrations',
          specializationId: SPECIALIZATION_IDS.backend,
          requiredSkillIds: [SKILL_IDS.node, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        },
        {
          id: 'mandatory-city-design',
          title: 'UX Designer',
          specializationId: SPECIALIZATION_IDS.design,
          requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        },
        {
          id: 'mandatory-city-data',
          title: 'Data Analyst',
          specializationId: SPECIALIZATION_IDS.analytics,
          requiredSkillIds: [SKILL_IDS.sql, SKILL_IDS.powerbi],
        },
      ],
    },
    subscriptions: [
      { userId: USER_IDS.egor, subscribedAt: timestamp('2026-03-10T09:15:00Z') },
      { userId: USER_IDS.lev, subscribedAt: timestamp('2026-03-11T11:20:00Z') },
      {
        userId: USER_IDS.anastasia,
        subscribedAt: timestamp('2026-03-12T07:40:00Z'),
      },
      { userId: USER_IDS.timur, subscribedAt: timestamp('2026-03-12T13:00:00Z') },
      { userId: USER_IDS.ksenia, subscribedAt: timestamp('2026-03-13T18:05:00Z') },
      { userId: USER_IDS.nikita, subscribedAt: timestamp('2026-03-14T08:10:00Z') },
      { userId: USER_IDS.polina, subscribedAt: timestamp('2026-03-15T09:10:00Z') },
      { userId: USER_IDS.viktor, subscribedAt: timestamp('2026-03-15T13:10:00Z') },
    ],
    createdAt: timestamp('2026-02-02T08:00:00Z'),
    updatedAt: timestamp('2026-03-19T14:40:00Z'),
  },
  {
    id: EVENT_IDS.fintechDesign,
    name: 'Fintech Design Challenge 2026',
    type: 'hackathon',
    description:
      'Онлайн-челлендж по продуктам для платежей, antifraud и финансового планирования. Упор на сильный UX и воспроизводимые данные.',
    registrationLink: 'https://studhack.dev/events/fintech-design-challenge-2026',
    location: {
      format: 'online',
      venueName: 'StudHack Online',
    },
    startsAt: timestamp('2026-06-06T09:00:00Z'),
    endsAt: timestamp('2026-06-07T18:00:00Z'),
    stages: [
      {
        id: 'stage-fintech-registration',
        code: 'registration_deadline',
        title: 'Окончание регистрации',
        startsAt: timestamp('2026-05-30T20:59:00Z'),
        endsAt: timestamp('2026-05-30T20:59:00Z'),
        order: 1,
      },
      {
        id: 'stage-fintech-sync',
        code: 'mentor_sync',
        title: 'Синк с менторами',
        startsAt: timestamp('2026-06-04T17:00:00Z'),
        endsAt: timestamp('2026-06-04T19:00:00Z'),
        order: 2,
      },
      {
        id: 'stage-fintech-start',
        code: 'hackathon_start',
        title: 'Старт челленджа',
        startsAt: timestamp('2026-06-06T09:00:00Z'),
        endsAt: timestamp('2026-06-06T09:15:00Z'),
        order: 3,
      },
      {
        id: 'stage-fintech-pitch',
        code: 'final_pitch',
        title: 'Финальный питч',
        startsAt: timestamp('2026-06-07T15:00:00Z'),
        endsAt: timestamp('2026-06-07T18:00:00Z'),
        order: 4,
      },
    ],
    hackathon: {
      minTeamSize: 3,
      maxTeamSize: 6,
      mandatoryPositions: [
        {
          id: 'mandatory-fintech-frontend',
          title: 'Frontend Engineer',
          specializationId: SPECIALIZATION_IDS.frontend,
          requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript, SKILL_IDS.rxjs],
        },
        {
          id: 'mandatory-fintech-backend',
          title: 'Backend / Data Engineer',
          specializationId: SPECIALIZATION_IDS.backend,
          requiredSkillIds: [SKILL_IDS.go, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        },
        {
          id: 'mandatory-fintech-design',
          title: 'Product Designer',
          specializationId: SPECIALIZATION_IDS.design,
          requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        },
      ],
    },
    subscriptions: [
      { userId: USER_IDS.egor, subscribedAt: timestamp('2026-03-17T09:00:00Z') },
      { userId: USER_IDS.alina, subscribedAt: timestamp('2026-03-18T10:00:00Z') },
      { userId: USER_IDS.maria, subscribedAt: timestamp('2026-03-18T10:20:00Z') },
      { userId: USER_IDS.artem, subscribedAt: timestamp('2026-03-18T11:00:00Z') },
      { userId: USER_IDS.polina, subscribedAt: timestamp('2026-03-18T11:10:00Z') },
    ],
    createdAt: timestamp('2026-03-01T10:00:00Z'),
    updatedAt: timestamp('2026-03-19T09:50:00Z'),
  },
  {
    id: EVENT_IDS.careerNight,
    name: 'Career Night x StudHack',
    type: 'other',
    description:
      'Вечерний формат с разбором портфолио, карьерных треков и быстрых нетворкинг-сессий между участниками и индустриальными менторами.',
    registrationLink: 'https://studhack.dev/events/career-night-2026',
    location: {
      format: 'offline',
      cityId: CITY_IDS.moscow,
      addressText: 'Берсеневская наб., 6 стр. 3',
      venueName: 'Digital October Hall',
      latitude: 55.74627,
      longitude: 37.60678,
    },
    startsAt: timestamp('2026-03-28T15:00:00Z'),
    endsAt: timestamp('2026-03-28T20:00:00Z'),
    stages: [
      {
        id: 'stage-career-checkin',
        code: 'checkin',
        title: 'Регистрация на площадке',
        startsAt: timestamp('2026-03-28T15:00:00Z'),
        endsAt: timestamp('2026-03-28T15:45:00Z'),
        order: 1,
      },
      {
        id: 'stage-career-talks',
        code: 'talks',
        title: 'Треки и выступления',
        startsAt: timestamp('2026-03-28T16:00:00Z'),
        endsAt: timestamp('2026-03-28T17:30:00Z'),
        order: 2,
      },
      {
        id: 'stage-career-networking',
        code: 'networking',
        title: 'Нетворкинг',
        startsAt: timestamp('2026-03-28T17:45:00Z'),
        endsAt: timestamp('2026-03-28T20:00:00Z'),
        order: 3,
      },
    ],
    hackathon: null,
    subscriptions: [
      { userId: USER_IDS.egor, subscribedAt: timestamp('2026-03-02T08:00:00Z') },
      { userId: USER_IDS.nikita, subscribedAt: timestamp('2026-03-02T08:10:00Z') },
      { userId: USER_IDS.yana, subscribedAt: timestamp('2026-03-02T08:15:00Z') },
      { userId: USER_IDS.viktor, subscribedAt: timestamp('2026-03-02T09:05:00Z') },
      { userId: USER_IDS.sofia, subscribedAt: timestamp('2026-03-03T09:45:00Z') },
      { userId: USER_IDS.polina, subscribedAt: timestamp('2026-03-03T10:15:00Z') },
    ],
    createdAt: timestamp('2026-02-18T08:00:00Z'),
    updatedAt: timestamp('2026-03-17T17:20:00Z'),
  },
];

const teams: MockTeamEntity[] = [
  {
    id: TEAM_IDS.neonWave,
    eventId: EVENT_IDS.aiProductJam,
    name: 'Neon Wave',
    description:
      'Собираем AI-ассистента для product ops: разбор пользовательских инсайтов, генерация action items и трекинг следующих итераций.',
    creatorUserId: USER_IDS.egor,
    captainUserId: USER_IDS.egor,
    positions: [
      {
        id: 'position-neon-frontend',
        title: 'Frontend Lead',
        description: 'Нужен человек, который соберет основной workspace и realtime UX.',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript, SKILL_IDS.rxjs],
        mandatoryPositionId: 'mandatory-ai-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.egor,
      },
      {
        id: 'position-neon-backend',
        title: 'Backend Engineer',
        description: 'API orchestration, post-processing и аккуратный data contract.',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.nest, SKILL_IDS.postgresql, SKILL_IDS.docker],
        mandatoryPositionId: 'mandatory-ai-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-neon-ml',
        title: 'ML Engineer',
        description: 'RAG-пайплайн, prompt evaluation и offline quality checks.',
        specializationId: SPECIALIZATION_IDS.ml,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.pytorch, SKILL_IDS.mlops],
        mandatoryPositionId: 'mandatory-ai-ml',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.daniil,
      },
      {
        id: 'position-neon-design',
        title: 'Product Designer',
        description: 'Потоки onboarding, summary cards и инструменты для фасилитатора.',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.maria,
      },
      {
        id: 'position-neon-data',
        title: 'Data Engineer',
        description: 'Подготовка фидбека, ETL для интервью и enrichment событий.',
        specializationId: SPECIALIZATION_IDS.data,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.sql, SKILL_IDS.fastapi],
        isMandatory: false,
        filledByExternal: false,
        userId: null,
      },
    ],
    createdAt: timestamp('2026-03-05T10:00:00Z'),
    updatedAt: timestamp('2026-03-19T09:20:00Z'),
  },
  {
    id: TEAM_IDS.tensorCats,
    eventId: EVENT_IDS.aiProductJam,
    name: 'Tensor Cats',
    description:
      'Делаем инструмент для semi-automatic QA диалоговых ассистентов с батчевой проверкой и сценарным покрытием.',
    creatorUserId: USER_IDS.sofia,
    captainUserId: USER_IDS.sofia,
    positions: [
      {
        id: 'position-tensor-product',
        title: 'Product Lead',
        specializationId: SPECIALIZATION_IDS.product,
        requiredSkillIds: [SKILL_IDS.productDiscovery, SKILL_IDS.powerbi],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.sofia,
      },
      {
        id: 'position-tensor-frontend',
        title: 'Frontend / Admin UI',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.react, SKILL_IDS.typescript],
        mandatoryPositionId: 'mandatory-ai-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.timur,
      },
      {
        id: 'position-tensor-backend',
        title: 'Backend Engineer',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.go, SKILL_IDS.postgresql],
        mandatoryPositionId: 'mandatory-ai-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.artem,
      },
      {
        id: 'position-tensor-ml',
        title: 'ML Evaluator',
        description: 'Ищем сильного ML-инженера под сценарные метрики и валидацию.',
        specializationId: SPECIALIZATION_IDS.ml,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.pytorch],
        mandatoryPositionId: 'mandatory-ai-ml',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-tensor-qa',
        title: 'QA Automation',
        specializationId: SPECIALIZATION_IDS.qa,
        requiredSkillIds: [SKILL_IDS.qaAutomation, SKILL_IDS.cypress],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.anastasia,
      },
    ],
    createdAt: timestamp('2026-03-06T12:20:00Z'),
    updatedAt: timestamp('2026-03-18T12:10:00Z'),
  },
  {
    id: TEAM_IDS.latencyZero,
    eventId: EVENT_IDS.aiProductJam,
    name: 'Latency Zero',
    description:
      'Команда строит low-latency API для голосового помощника службы поддержки с маршрутизацией обращений.',
    creatorUserId: USER_IDS.roman,
    captainUserId: USER_IDS.roman,
    positions: [
      {
        id: 'position-latency-backend',
        title: 'Core Backend',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.go, SKILL_IDS.kafka, SKILL_IDS.postgresql],
        mandatoryPositionId: 'mandatory-ai-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.roman,
      },
      {
        id: 'position-latency-frontend',
        title: 'Frontend Console',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript],
        mandatoryPositionId: 'mandatory-ai-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-latency-ml',
        title: 'Speech / ML Engineer',
        specializationId: SPECIALIZATION_IDS.ml,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.computerVision, SKILL_IDS.mlops],
        mandatoryPositionId: 'mandatory-ai-ml',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.elizaveta,
      },
      {
        id: 'position-latency-devops',
        title: 'Infra / DevOps',
        specializationId: SPECIALIZATION_IDS.devops,
        requiredSkillIds: [SKILL_IDS.docker, SKILL_IDS.kubernetes],
        isMandatory: false,
        filledByExternal: true,
        userId: null,
      },
    ],
    createdAt: timestamp('2026-03-08T10:10:00Z'),
    updatedAt: timestamp('2026-03-17T16:25:00Z'),
  },
  {
    id: TEAM_IDS.urbanPulse,
    eventId: EVENT_IDS.smartCity,
    name: 'Urban Pulse',
    description:
      'Делаем панель для анализа пробок и аномалий маршрутов общественного транспорта с картой и предиктивными подсказками.',
    creatorUserId: USER_IDS.ksenia,
    captainUserId: USER_IDS.ksenia,
    positions: [
      {
        id: 'position-urban-frontend',
        title: 'Frontend / Map UI',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.react, SKILL_IDS.typescript, SKILL_IDS.maplibre],
        mandatoryPositionId: 'mandatory-city-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.nikita,
      },
      {
        id: 'position-urban-backend',
        title: 'Backend Integrations',
        description: 'Нужно собирать городские API и держать консистентные агрегации.',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.node, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        mandatoryPositionId: 'mandatory-city-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-urban-design',
        title: 'UX Designer',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        mandatoryPositionId: 'mandatory-city-design',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.ksenia,
      },
      {
        id: 'position-urban-analyst',
        title: 'Data Analyst',
        specializationId: SPECIALIZATION_IDS.analytics,
        requiredSkillIds: [SKILL_IDS.sql, SKILL_IDS.powerbi],
        mandatoryPositionId: 'mandatory-city-data',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-urban-pm',
        title: 'Product Manager',
        specializationId: SPECIALIZATION_IDS.product,
        requiredSkillIds: [SKILL_IDS.productDiscovery, SKILL_IDS.powerbi],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.polina,
      },
    ],
    createdAt: timestamp('2026-03-11T09:10:00Z'),
    updatedAt: timestamp('2026-03-19T15:00:00Z'),
  },
  {
    id: TEAM_IDS.routeScout,
    eventId: EVENT_IDS.smartCity,
    name: 'Route Scout',
    description:
      'Команда делает мобильный прототип и диспетчерскую панель для повышения доступности маршрутов и прозрачности инцидентов.',
    creatorUserId: USER_IDS.lev,
    captainUserId: USER_IDS.lev,
    positions: [
      {
        id: 'position-route-backend',
        title: 'Backend / Mobile API',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.fastapi, SKILL_IDS.postgresql],
        mandatoryPositionId: 'mandatory-city-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.lev,
      },
      {
        id: 'position-route-frontend',
        title: 'Map Frontend',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.react, SKILL_IDS.maplibre],
        mandatoryPositionId: 'mandatory-city-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-route-design',
        title: 'UX Designer',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        mandatoryPositionId: 'mandatory-city-design',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-route-analyst',
        title: 'Data Analyst',
        specializationId: SPECIALIZATION_IDS.analytics,
        requiredSkillIds: [SKILL_IDS.sql, SKILL_IDS.powerbi],
        mandatoryPositionId: 'mandatory-city-data',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.anastasia,
      },
      {
        id: 'position-route-gis',
        title: 'GIS Engineer',
        specializationId: SPECIALIZATION_IDS.data,
        requiredSkillIds: [SKILL_IDS.maplibre, SKILL_IDS.sql],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.viktor,
      },
    ],
    createdAt: timestamp('2026-03-09T14:20:00Z'),
    updatedAt: timestamp('2026-03-18T18:10:00Z'),
  },
  {
    id: TEAM_IDS.citySense,
    eventId: EVENT_IDS.smartCity,
    name: 'City Sense',
    description:
      'Собирают AI-помощника для мониторинга заявок от жителей и приоритизации городских работ по районам.',
    creatorUserId: USER_IDS.alina,
    captainUserId: USER_IDS.alina,
    positions: [
      {
        id: 'position-sense-backend',
        title: 'Backend Engineer',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.nest, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        mandatoryPositionId: 'mandatory-city-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.alina,
      },
      {
        id: 'position-sense-frontend',
        title: 'Frontend Dashboard',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript],
        mandatoryPositionId: 'mandatory-city-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.timur,
      },
      {
        id: 'position-sense-design',
        title: 'Product Designer',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        mandatoryPositionId: 'mandatory-city-design',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.yana,
      },
      {
        id: 'position-sense-analyst',
        title: 'Analyst',
        specializationId: SPECIALIZATION_IDS.analytics,
        requiredSkillIds: [SKILL_IDS.sql, SKILL_IDS.powerbi],
        mandatoryPositionId: 'mandatory-city-data',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.polina,
      },
      {
        id: 'position-sense-ml',
        title: 'ML Engineer',
        specializationId: SPECIALIZATION_IDS.ml,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.pytorch],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.daniil,
      },
    ],
    createdAt: timestamp('2026-03-10T11:05:00Z'),
    updatedAt: timestamp('2026-03-19T08:35:00Z'),
  },
  {
    id: TEAM_IDS.liquidSignals,
    eventId: EVENT_IDS.fintechDesign,
    name: 'Liquid Signals',
    description:
      'Прототипируем продукт для финансового здоровья с персональными инсайтами, UX guardrails и explainable scoring.',
    creatorUserId: USER_IDS.polina,
    captainUserId: USER_IDS.polina,
    positions: [
      {
        id: 'position-liquid-product',
        title: 'Product Lead',
        specializationId: SPECIALIZATION_IDS.product,
        requiredSkillIds: [SKILL_IDS.productDiscovery, SKILL_IDS.powerbi],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.polina,
      },
      {
        id: 'position-liquid-backend',
        title: 'Backend / Scoring API',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.nest, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        mandatoryPositionId: 'mandatory-fintech-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.alina,
      },
      {
        id: 'position-liquid-design',
        title: 'Product Designer',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        mandatoryPositionId: 'mandatory-fintech-design',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.maria,
      },
      {
        id: 'position-liquid-frontend',
        title: 'Frontend Engineer',
        description: 'Ищем сильного фронта под onboarding и data-dense dashboard.',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.angular, SKILL_IDS.typescript, SKILL_IDS.rxjs],
        mandatoryPositionId: 'mandatory-fintech-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-liquid-risk',
        title: 'Risk / ML Researcher',
        specializationId: SPECIALIZATION_IDS.ml,
        requiredSkillIds: [SKILL_IDS.python, SKILL_IDS.sql],
        isMandatory: false,
        filledByExternal: false,
        userId: null,
      },
    ],
    createdAt: timestamp('2026-03-18T09:15:00Z'),
    updatedAt: timestamp('2026-03-19T10:05:00Z'),
  },
  {
    id: TEAM_IDS.ledgerLab,
    eventId: EVENT_IDS.fintechDesign,
    name: 'Ledger Lab',
    description:
      'Делаем внутренний antifraud-кабинет с explainability, очередями кейсов и ручным review.',
    creatorUserId: USER_IDS.artem,
    captainUserId: USER_IDS.artem,
    positions: [
      {
        id: 'position-ledger-backend',
        title: 'Backend Core',
        specializationId: SPECIALIZATION_IDS.backend,
        requiredSkillIds: [SKILL_IDS.go, SKILL_IDS.postgresql, SKILL_IDS.kafka],
        mandatoryPositionId: 'mandatory-fintech-backend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.artem,
      },
      {
        id: 'position-ledger-frontend',
        title: 'Frontend / Cases UI',
        specializationId: SPECIALIZATION_IDS.frontend,
        requiredSkillIds: [SKILL_IDS.react, SKILL_IDS.typescript],
        mandatoryPositionId: 'mandatory-fintech-frontend',
        isMandatory: true,
        filledByExternal: false,
        userId: USER_IDS.timur,
      },
      {
        id: 'position-ledger-design',
        title: 'Designer',
        specializationId: SPECIALIZATION_IDS.design,
        requiredSkillIds: [SKILL_IDS.figma, SKILL_IDS.uxResearch],
        mandatoryPositionId: 'mandatory-fintech-design',
        isMandatory: true,
        filledByExternal: false,
        userId: null,
      },
      {
        id: 'position-ledger-qa',
        title: 'QA / Analyst',
        specializationId: SPECIALIZATION_IDS.qa,
        requiredSkillIds: [SKILL_IDS.qaAutomation, SKILL_IDS.cypress, SKILL_IDS.sql],
        isMandatory: false,
        filledByExternal: false,
        userId: USER_IDS.anastasia,
      },
    ],
    createdAt: timestamp('2026-03-18T11:00:00Z'),
    updatedAt: timestamp('2026-03-19T11:10:00Z'),
  },
];

const teamRequests: MockTeamRequestEntity[] = [
  {
    id: 'request-neon-invite-alina',
    type: 'invitation',
    status: 'pending',
    message:
      'Привет. У нас уже есть frontend и ML, не хватает сильного backend-а под clean API и data contracts.',
    userId: USER_IDS.alina,
    createdByUserId: USER_IDS.egor,
    teamId: TEAM_IDS.neonWave,
    teamPositionId: 'position-neon-backend',
    createdAt: timestamp('2026-03-18T10:20:00Z'),
  },
  {
    id: 'request-neon-application-viktor',
    type: 'application',
    status: 'pending',
    message:
      'Могу закрыть ETL и подготовку данных, плюс помочь с FastAPI для enrichment-сервисов.',
    userId: USER_IDS.viktor,
    createdByUserId: USER_IDS.viktor,
    teamId: TEAM_IDS.neonWave,
    teamPositionId: 'position-neon-data',
    createdAt: timestamp('2026-03-18T11:00:00Z'),
  },
  {
    id: 'request-neon-application-yana',
    type: 'application',
    status: 'rejected',
    message:
      'Могу подключиться на UX и быстрый прототип, если нужен еще один человек на дизайн-поток.',
    userId: USER_IDS.yana,
    createdByUserId: USER_IDS.yana,
    teamId: TEAM_IDS.neonWave,
    teamPositionId: 'position-neon-design',
    createdAt: timestamp('2026-03-14T08:25:00Z'),
    resolvedAt: timestamp('2026-03-15T14:00:00Z'),
  },
  {
    id: 'request-tensor-application-elizaveta',
    type: 'application',
    status: 'pending',
    message:
      'Готова взять validation pipeline и табличные метрики для quality dashboard.',
    userId: USER_IDS.elizaveta,
    createdByUserId: USER_IDS.elizaveta,
    teamId: TEAM_IDS.tensorCats,
    teamPositionId: 'position-tensor-ml',
    createdAt: timestamp('2026-03-17T09:00:00Z'),
  },
  {
    id: 'request-latency-invite-nikita',
    type: 'invitation',
    status: 'pending',
    message:
      'Нужен быстрый frontend под операторскую консоль, UI там несложный, но latency-sensitive.',
    userId: USER_IDS.nikita,
    createdByUserId: USER_IDS.roman,
    teamId: TEAM_IDS.latencyZero,
    teamPositionId: 'position-latency-frontend',
    createdAt: timestamp('2026-03-16T18:30:00Z'),
  },
  {
    id: 'request-urban-invite-alina',
    type: 'invitation',
    status: 'pending',
    message:
      'У нас уже есть карта и дизайн, но не хватает человека под интеграции и сборку backend-контура.',
    userId: USER_IDS.alina,
    createdByUserId: USER_IDS.ksenia,
    teamId: TEAM_IDS.urbanPulse,
    teamPositionId: 'position-urban-backend',
    createdAt: timestamp('2026-03-19T08:30:00Z'),
  },
  {
    id: 'request-route-application-egor',
    type: 'application',
    status: 'pending',
    message:
      'Могу забрать карту, фильтры по инцидентам и быстрый адаптивный кабинет для диспетчера.',
    userId: USER_IDS.egor,
    createdByUserId: USER_IDS.egor,
    teamId: TEAM_IDS.routeScout,
    teamPositionId: 'position-route-frontend',
    createdAt: timestamp('2026-03-18T18:40:00Z'),
  },
  {
    id: 'request-route-application-yana',
    type: 'application',
    status: 'pending',
    message:
      'Интересен civic-tech кейс, могу быстро сделать UX flow по поиску маршрутов и доступности.',
    userId: USER_IDS.yana,
    createdByUserId: USER_IDS.yana,
    teamId: TEAM_IDS.routeScout,
    teamPositionId: 'position-route-design',
    createdAt: timestamp('2026-03-18T17:20:00Z'),
  },
  {
    id: 'request-route-invite-viktor',
    type: 'invitation',
    status: 'approved',
    message:
      'Нужен человек на GIS-данные и подготовку выгрузок для карты. Сможешь помочь?',
    userId: USER_IDS.viktor,
    createdByUserId: USER_IDS.lev,
    teamId: TEAM_IDS.routeScout,
    teamPositionId: 'position-route-gis',
    createdAt: timestamp('2026-03-10T12:10:00Z'),
    resolvedAt: timestamp('2026-03-11T09:10:00Z'),
  },
  {
    id: 'request-liquid-invite-egor',
    type: 'invitation',
    status: 'pending',
    message:
      'Нужен аккуратный frontend под сложный onboarding и dashboard. Видели твои последние UI, очень подходит.',
    userId: USER_IDS.egor,
    createdByUserId: USER_IDS.polina,
    teamId: TEAM_IDS.liquidSignals,
    teamPositionId: 'position-liquid-frontend',
    createdAt: timestamp('2026-03-19T10:10:00Z'),
  },
  {
    id: 'request-liquid-application-elizaveta',
    type: 'application',
    status: 'pending',
    message:
      'Могу взять risk-модель, признаки и быструю sanity-check валидацию прямо по ходу спринта.',
    userId: USER_IDS.elizaveta,
    createdByUserId: USER_IDS.elizaveta,
    teamId: TEAM_IDS.liquidSignals,
    teamPositionId: 'position-liquid-risk',
    createdAt: timestamp('2026-03-19T10:30:00Z'),
  },
  {
    id: 'request-ledger-invite-yana',
    type: 'invitation',
    status: 'cancelled',
    message:
      'Искали дизайнера под antifraud кабинет, но решили временно закрыть прототип внутри команды.',
    userId: USER_IDS.yana,
    createdByUserId: USER_IDS.artem,
    teamId: TEAM_IDS.ledgerLab,
    teamPositionId: 'position-ledger-design',
    createdAt: timestamp('2026-03-18T12:40:00Z'),
    resolvedAt: timestamp('2026-03-18T18:00:00Z'),
  },
];

const pendingCurrentUser: MockPendingCurrentUserEntity = {
  id: null,
  uniqueName: 'maria.oauth',
  displayName: 'Мария Федорова',
  available: true,
  cityOfResidenceId: CITY_IDS.saintPetersburg,
  email: 'maria.fedorova@example.com',
  biography:
    'Часть данных уже пришла из OAuth и бэка. Проверьте профиль и завершите регистрацию.',
  avatarUrl: avatarUrl('maria-oauth'),
  specializationIds: [SPECIALIZATION_IDS.frontend, SPECIALIZATION_IDS.design],
  skillIds: [SKILL_IDS.react, SKILL_IDS.typescript, SKILL_IDS.figma],
  portfolioLinks: [
    {
      id: 'portfolio-oauth-001',
      url: 'https://github.com/maria-oauth',
      description: 'GitHub профиль',
    },
  ],
  educations: [
    {
      id: 'education-oauth-001',
      universityId: UNIVERSITY_IDS.itmo,
      degree: 'bachelor',
      faculty: 'Факультет программной инженерии',
      yearStart: 2023,
      yearEnd: 2027,
    },
  ],
};

const seed: MockDatabaseState = {
  meUserId: USER_IDS.egor,
  currentUserId: null,
  pendingCurrentUser,
  dictionaries,
  users,
  events,
  teams,
  teamRequests,
};

export const createMockDatabaseState = (): MockDatabaseState =>
  structuredClone(seed);
