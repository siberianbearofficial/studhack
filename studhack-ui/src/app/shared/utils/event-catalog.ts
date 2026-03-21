import { type EventFormat, type EventFullDto } from '@core/api';

export const EVENT_TEAM_SIZE_MIN = 2;
export const EVENT_TEAM_SIZE_MAX = 9;
export const EVENT_DIFFICULTY_MAX = 2500;
export const EVENT_HIGH_DIFFICULTY_THRESHOLD = 1700;
export const EVENT_TEAM_SIZE_STEPS = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9+' },
] as const;

export interface EventDifficultyGrade {
  readonly max: number;
  readonly value: number;
  readonly label: string;
  readonly color: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const FORMAT_LABELS: Record<EventFormat, string> = {
  online: 'Онлайн',
  offline: 'Очное',
  hybrid: 'Гибрид',
};
const EVENT_COVER_BACKGROUNDS = [
  'linear-gradient(135deg, rgb(18 63 131) 0%, rgb(30 112 172) 42%, rgb(120 211 212) 100%)',
  'linear-gradient(135deg, rgb(122 43 20) 0%, rgb(191 94 47) 45%, rgb(255 208 125) 100%)',
  'linear-gradient(135deg, rgb(32 84 74) 0%, rgb(56 140 123) 50%, rgb(189 232 202) 100%)',
  'linear-gradient(135deg, rgb(86 32 121) 0%, rgb(166 53 133) 52%, rgb(255 166 111) 100%)',
];
const COVER_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
});

export function getEventTypeLabel(event: EventFullDto): string {
  return event.type === 'hackathon' ? 'Хакатон' : 'Мероприятие';
}

export function getEventFormatLabel(format: EventFormat): string {
  return FORMAT_LABELS[format];
}

export function getEventLocationLabel(event: EventFullDto): string {
  return event.location.city?.name ?? getEventFormatLabel(event.location.format);
}

export function getEventDateSpanLabel(event: EventFullDto): string {
  const start = normalizeDateLabel(COVER_DATE_FORMATTER.format(new Date(event.startsAt)));
  const end = normalizeDateLabel(COVER_DATE_FORMATTER.format(new Date(event.endsAt)));

  return start === end ? start : `${start} - ${end}`;
}

export function getEventCoverBackground(event: EventFullDto): string {
  return EVENT_COVER_BACKGROUNDS[
    hashString(`${event.id}:${event.name}`) % EVENT_COVER_BACKGROUNDS.length
  ];
}

export function hasInPersonParticipation(event: EventFullDto): boolean {
  return event.location.format !== 'online';
}

export function isMultiDayEvent(event: EventFullDto): boolean {
  return dayStamp(new Date(event.startsAt)) !== dayStamp(new Date(event.endsAt));
}

export function getEventDurationDays(event: EventFullDto): number {
  const start = startOfLocalDay(new Date(event.startsAt)).getTime();
  const end = startOfLocalDay(new Date(event.endsAt)).getTime();

  return Math.max(1, Math.floor((end - start) / DAY_IN_MS) + 1);
}

export function getEventStartsInLabel(
  event: EventFullDto,
  now: Date = new Date(),
): string {
  const diff = new Date(event.startsAt).getTime() - now.getTime();

  if (diff <= 0) {
    return 'Стартовало';
  }

  const days = Math.ceil(diff / DAY_IN_MS);

  if (days >= 1) {
    return `${days} ${pluralize(days, 'день', 'дня', 'дней')}`;
  }

  const hours = Math.max(1, Math.ceil(diff / HOUR_IN_MS));

  return `${hours} ч`;
}

export function getEventTeamSizeBounds(
  event: EventFullDto,
): readonly [number, number] {
  const min = clamp(
    event.hackathon?.minTeamSize ?? EVENT_TEAM_SIZE_MIN,
    EVENT_TEAM_SIZE_MIN,
    EVENT_TEAM_SIZE_MAX,
  );
  const max = clamp(
    event.hackathon?.maxTeamSize ?? min,
    EVENT_TEAM_SIZE_MIN,
    EVENT_TEAM_SIZE_MAX,
  );

  return min <= max ? [min, max] : [max, min];
}

export function formatEventTeamSize(value: number): string {
  return value >= EVENT_TEAM_SIZE_MAX ? '9+' : `${value}`;
}

export function formatEventTeamSizeRange(
  [min, max]: readonly [number, number],
): string {
  const start = formatEventTeamSize(min);
  const end = formatEventTeamSize(max);

  if (min === max) {
    return `${start} участника`;
  }

  return `${start}-${end} участников`;
}

export function hasRealCasesTag(event: EventFullDto): boolean {
  return event.type === 'hackathon';
}

export function isHighDifficultyEvent(event: EventFullDto): boolean {
  return getEventDifficulty(event).value >= EVENT_HIGH_DIFFICULTY_THRESHOLD;
}

export function getEventDifficulty(event: EventFullDto): EventDifficultyGrade {
  const [, maxTeamSize] = getEventTeamSizeBounds(event);
  const mandatoryPositions = event.hackathon?.mandatoryPositions.length ?? 0;
  const requiredSkills =
    event.hackathon?.mandatoryPositions.reduce(
      (total, position) => total + position.requiredSkills.length,
      0,
    ) ?? 0;
  const durationDays = getEventDurationDays(event);
  const value = Math.min(
    EVENT_DIFFICULTY_MAX,
    (event.hackathon ? 400 : 200) +
      mandatoryPositions * 160 +
      maxTeamSize * 60 +
      requiredSkills * 40 +
      event.stages.length * 50 +
      (durationDays > 1 ? 90 : 0) +
      (hasInPersonParticipation(event) ? 40 : 0),
  );

  return {
    max: EVENT_DIFFICULTY_MAX,
    value,
    label: formatCompactNumber(value),
    color: getDifficultyColor(value),
  };
}

function getDifficultyColor(value: number): string {
  const ratio = EVENT_DIFFICULTY_MAX ? value / EVENT_DIFFICULTY_MAX : 0;
  const hue = Math.round(130 - ratio * 130);

  return `hsl(${hue} 72% 46%)`;
}

function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return `${value}`;
}

function normalizeDateLabel(label: string): string {
  return label.replace('.', '');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function dayStamp(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function pluralize(
  value: number,
  one: string,
  few: string,
  many: string,
): string {
  const modulo10 = value % 10;
  const modulo100 = value % 100;

  if (modulo10 === 1 && modulo100 !== 11) {
    return one;
  }

  if (modulo10 >= 2 && modulo10 <= 4 && (modulo100 < 12 || modulo100 > 14)) {
    return few;
  }

  return many;
}

function hashString(value: string): number {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}
