
import type { Actor, Role } from './types';

// The initial seed data for the database
const initialActors: Actor[] = [
  // 10 Famous Adults
  {
    id: 1,
    name: 'Chris Hemsworth',
    age: 40,
    gender: 'male',
    physical_attributes: { height: "6' 3\"", build: 'athletic', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['martial arts', 'horseback riding', 'stunts'],
    emotional_traits: ['confident', 'charismatic'],
    portfolio_url: 'https://www.imdb.com/name/nm1165110/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg',
    created_at: '2024-07-29T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Scarlett Johansson',
    age: 39,
    gender: 'female',
    physical_attributes: { height: "5' 3\"", build: 'athletic', hair_color: 'blonde', eye_color: 'green' },
    skills: ['martial arts', 'singing', 'russian'],
    emotional_traits: ['intense', 'mysterious', 'witty'],
    portfolio_url: 'https://www.imdb.com/name/nm0424060/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Scarlett_Johansson-8588.jpg/960px-Scarlett_Johansson-8588.jpg',
    created_at: '2024-07-29T10:01:00.000Z'
  },
  {
    id: 15,
    name: 'Dwayne Johnson',
    age: 52,
    gender: 'male',
    physical_attributes: { height: '6\' 5"', build: 'heavy', hair_color: 'other', eye_color: 'brown' },
    skills: ['stunts', 'comedy', 'wrestling'],
    emotional_traits: ['charismatic', 'commanding', 'playful'],
    portfolio_url: 'https://www.imdb.com/name/nm0425005/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Dwayne_Johnson-1809_%28cropped%29.jpg/960px-Dwayne_Johnson-1809_%28cropped%29.jpg',
    created_at: '2024-07-29T10:14:00.000Z'
  },
  {
    id: 6,
    name: 'Zendaya',
    age: 27,
    gender: 'female',
    physical_attributes: { height: '5\' 10"', build: 'slim', hair_color: 'brown', eye_color: 'hazel' },
    skills: ['singing', 'dancing', 'acting'],
    emotional_traits: ['confident', 'graceful'],
    portfolio_url: 'https://www.imdb.com/name/nm3918035/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/960px-Zendaya_-_2019_by_Glenn_Francis.jpg',
    created_at: '2024-07-29T10:05:00.000Z'
  },
  {
    id: 9,
    name: 'Keanu Reeves',
    age: 59,
    gender: 'male',
    physical_attributes: { height: '6\' 1"', build: 'slim', hair_color: 'black', eye_color: 'hazel' },
    skills: ['martial arts', 'stunts', 'motorcycling'],
    emotional_traits: ['stoic', 'brooding', 'noble'],
    portfolio_url: 'https://www.imdb.com/name/nm0000206/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg/960px-Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg',
    created_at: '2024-07-29T10:08:00.000Z'
  },
  {
    id: 16,
    name: 'Margot Robbie',
    age: 33,
    gender: 'female',
    physical_attributes: { height: '5\' 6"', build: 'athletic', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['ice skating', 'trapeze', 'accents'],
    emotional_traits: ['energetic', 'manic', 'charismatic'],
    portfolio_url: 'https://www.imdb.com/name/nm3053338/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg/960px-Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg',
    created_at: '2024-07-29T10:15:00.000Z'
  },
  {
    id: 27,
    name: 'Ryan Gosling',
    age: 43,
    gender: 'male',
    physical_attributes: { height: '6\' 0"', build: 'average', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['singing', 'dancing', 'piano'],
    emotional_traits: ['charming', 'brooding', 'comedic'],
    portfolio_url: 'https://www.imdb.com/name/nm0331516/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/GoslingBFI081223_%2822_of_30%29_%2853388157347%29_%28cropped%29.jpg',
    created_at: '2024-07-29T10:26:00.000Z'
  },
  {
    id: 33,
    name: 'Meryl Streep',
    age: 75,
    gender: 'female',
    physical_attributes: { height: '5\' 6"', build: 'average', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['accents', 'singing', 'dramatic range'],
    emotional_traits: ['versatile', 'powerful', 'nuanced'],
    portfolio_url: 'https://www.imdb.com/name/nm0000658/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Meryl_Streep_by_Jack_Mitchell.jpg',
    created_at: '2024-07-29T10:32:00.000Z'
  },
  {
    id: 26,
    name: 'Viola Davis',
    age: 58,
    gender: 'female',
    physical_attributes: { height: '5\' 5"', build: 'average', hair_color: 'black', eye_color: 'brown' },
    skills: ['dramatic range', 'producing', 'method acting'],
    emotional_traits: ['powerful', 'vulnerable', 'authoritative'],
    portfolio_url: 'https://www.imdb.com/name/nm0205626/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Viola_Davis_at_the_Air_Premiere_at_SXSW_%28cropped%29.jpg',
    created_at: '2024-07-29T10:25:00.000Z'
  },
  {
    id: 38,
    name: 'Tom Hardy',
    age: 46,
    gender: 'male',
    physical_attributes: { height: '5\' 9"', build: 'athletic', hair_color: 'brown', eye_color: 'blue' },
    skills: ['method acting', 'stunts', 'accents'],
    emotional_traits: ['intense', 'volatile', 'charismatic'],
    portfolio_url: 'https://www.imdb.com/name/nm0362766/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tom_Hardy_by_Gage_Skidmore_in_2018.jpg/960px-Tom_Hardy_by_Gage_Skidmore_in_2018.jpg',
    created_at: '2024-07-29T10:37:00.000Z'
  },
  // 10 Famous Kid/Young Actors
  {
    id: 55,
    name: 'Millie Bobby Brown',
    age: 20,
    gender: 'female',
    physical_attributes: { height: '5\' 4"', build: 'slim', hair_color: 'brown', eye_color: 'hazel' },
    skills: ['acting', 'singing', 'model'],
    emotional_traits: ['intense', 'powerful', 'vulnerable'],
    portfolio_url: 'https://www.imdb.com/name/nm5611121/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Millie_Bobby_Brown_-_MBB_-_4_-_SFM5_-_July_10%2C_2022_at_Stranger_Fan_Meet_5_People_Convention_%28cropped%29.jpg/960px-Millie_Bobby_Brown_-_MBB_-_4_-_SFM5_-_July_10%2C_2022_at_Stranger_Fan_Meet_5_People_Convention_%28cropped%29.jpg',
    created_at: '2024-07-30T12:04:00Z'
  },
  {
    id: 58,
    name: 'Gaten Matarazzo',
    age: 21,
    gender: 'male',
    physical_attributes: { height: '5\' 5"', build: 'average', hair_color: 'brown', eye_color: 'blue' },
    skills: ['acting', 'singing', 'comedy'],
    emotional_traits: ['lovable', 'funny', 'loyal'],
    portfolio_url: 'https://www.imdb.com/name/nm7140802/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gaten_Matarazzo.jpg/960px-Gaten_Matarazzo.jpg',
    created_at: '2024-07-30T12:07:00Z'
  },
  {
    id: 59,
    name: 'Finn Wolfhard',
    age: 21,
    gender: 'male',
    physical_attributes: { height: '5\' 10"', build: 'slim', hair_color: 'black', eye_color: 'brown' },
    skills: ['acting', 'singing', 'guitar', 'directing'],
    emotional_traits: ['witty', 'anxious', 'loyal'],
    portfolio_url: 'https://www.imdb.com/name/nm6016511/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Stranger_Things_cast_2025_%282%29_%28cropped%29.png',
    created_at: '2024-07-30T12:08:00Z'
  },
  {
    id: 60,
    name: 'Caleb McLaughlin',
    age: 22,
    gender: 'male',
    physical_attributes: { height: '5\' 8"', build: 'athletic', hair_color: 'black', eye_color: 'brown' },
    skills: ['acting', 'dancing', 'singing'],
    emotional_traits: ['skeptical', 'brave', 'loyal'],
    portfolio_url: 'https://www.imdb.com/name/nm5155681/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Caleb_McLaughlin_2025_%281%29.png',
    created_at: '2024-07-30T12:09:00Z'
  },
  {
    id: 61,
    name: 'Sadie Sink',
    age: 22,
    gender: 'female',
    physical_attributes: { height: '5\' 3"', build: 'slim', hair_color: 'red', eye_color: 'blue' },
    skills: ['acting', 'singing', 'dancing'],
    emotional_traits: ['tough', 'sarcastic', 'resilient'],
    portfolio_url: 'https://www.imdb.com/name/nm5569351/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Sadie_Sink_%2843914734441%29.jpg',
    created_at: '2024-07-30T12:10:00Z'
  },
  {
    id: 51,
    name: 'Iain Armitage',
    age: 15,
    gender: 'male',
    physical_attributes: { height: '5\' 7"', build: 'slim', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['acting', 'theatre', 'singing'],
    emotional_traits: ['precocious', 'intelligent', 'witty'],
    portfolio_url: 'https://www.imdb.com/name/nm8128362/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Iain_Armitage_and_Jane_Fonda_at_Fire_Drill_Fridays_protest_%28cropped%29.jpg',
    created_at: '2024-07-30T12:00:00Z'
  },
  {
    id: 52,
    name: 'Mckenna Grace',
    age: 17,
    gender: 'female',
    physical_attributes: { height: '5\' 0"', build: 'slim', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['acting', 'singing', 'guitar'],
    emotional_traits: ['vulnerable', 'intelligent', 'mature'],
    portfolio_url: 'https://www.imdb.com/name/nm5034562/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/McKenna_Grace_at_WWD_Style_Awards_2026.jpg/960px-McKenna_Grace_at_WWD_Style_Awards_2026.jpg',
    created_at: '2024-07-30T12:01:00Z'
  },
  {
    id: 53,
    name: 'Jacob Tremblay',
    age: 17,
    gender: 'male',
    physical_attributes: { height: '4\' 8"', build: 'slim', hair_color: 'brown', eye_color: 'blue' },
    skills: ['acting', 'voice acting'],
    emotional_traits: ['earnest', 'vulnerable', 'charming'],
    portfolio_url: 'https://www.imdb.com/name/nm5016878/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Jacob_Tremblay_by_Gage_Skidmore.jpg/960px-Jacob_Tremblay_by_Gage_Skidmore.jpg',
    created_at: '2024-07-30T12:02:00Z'
  },
  {
    id: 14,
    name: 'Jenna Ortega',
    age: 21,
    gender: 'female',
    physical_attributes: { height: '5\' 1"', build: 'slim', hair_color: 'black', eye_color: 'brown' },
    skills: ['cello', 'fencing', 'german'],
    emotional_traits: ['deadpan', 'witty', 'intense'],
    portfolio_url: 'https://www.imdb.com/name/nm4682202/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Jenna_Ortega-63799_%28cropped%29.jpg/960px-Jenna_Ortega-63799_%28cropped%29.jpg',
    created_at: '2024-07-29T10:13:00.000Z'
  },
  {
    id: 63,
    name: 'Walker Scobell',
    age: 15,
    gender: 'male',
    physical_attributes: { height: '5\' 4"', build: 'slim', hair_color: 'blonde', eye_color: 'blue' },
    skills: ['acting', 'comedy'],
    emotional_traits: ['witty', 'sarcastic', 'charming'],
    portfolio_url: 'https://www.imdb.com/name/nm12292496/',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Walker_Scobell_by_Gage_Skidmore_2.jpg/960px-Walker_Scobell_by_Gage_Skidmore_2.jpg',
    created_at: '2024-07-30T12:12:00Z'
  }
];

const initialRoles: Role[] = [
  {
    id: 1,
    project_name: 'Relentless Pursuit',
    character_name: 'Ex-Assassin "The Ghost"',
    age_range_min: 35,
    age_range_max: 45,
    gender: 'any',
    physical_requirements: { build: 'athletic' },
    required_skills: ['martial arts', 'stunts', 'combat training'],
    emotional_traits: ['stoic', 'intense', 'methodical'],
    genre: 'action',
    description: 'A retired legendary assassin is pulled back into the life they left behind. Requires peak physical condition and ability to convey a history of violence and regret through minimal dialogue.',
    created_at: '2024-07-29T11:00:00.000Z'
  },
  {
    id: 2,
    project_name: 'Summer in the City',
    character_name: 'Witty Journalist',
    age_range_min: 25,
    age_range_max: 35,
    gender: 'female',
    physical_requirements: {},
    required_skills: ['comedy', 'improvisation'],
    emotional_traits: ['charismatic', 'witty', 'relatable'],
    genre: 'romance',
    description: 'A charming, slightly cynical journalist navigates love and career in a bustling city. Must have excellent comedic timing and ability to be both funny and vulnerable.',
    created_at: '2024-07-29T11:01:00.000Z'
  },
  {
    id: 3,
    project_name: 'The Statesman',
    character_name: 'Visionary President',
    age_range_min: 50,
    age_range_max: 65,
    gender: 'male',
    physical_requirements: {},
    required_skills: ['dramatic range', 'public speaking'],
    emotional_traits: ['authoritative', 'compassionate', 'resilient'],
    genre: 'drama',
    description: 'A biopic of a revered president facing a national crisis. Requires ability to portray immense pressure, gravitas, and quiet moments of vulnerability.',
    created_at: '2024-07-29T11:02:00.000Z'
  },
  {
    id: 4,
    project_name: 'Project Chimera',
    character_name: 'Reluctant Superhero',
    age_range_min: 22,
    age_range_max: 28,
    gender: 'any',
    physical_requirements: { build: 'athletic' },
    required_skills: ['stunts', 'gymnastics'],
    emotional_traits: ['conflicted', 'heroic', 'witty'],
    genre: 'sci-fi',
    description: 'A young adult gains extraordinary powers and must grapple with the responsibility. Physical agility and the ability to portray a journey from uncertainty to confidence is key.',
    created_at: '2024-07-29T11:03:00.000Z'
  },
  {
    id: 5,
    project_name: 'City of Shadows',
    character_name: 'Hard-boiled Detective',
    age_range_min: 40,
    age_range_max: 55,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['dramatic range'],
    emotional_traits: ['brooding', 'intense', 'cynical'],
    genre: 'thriller',
    description: 'A world-weary detective hunting a serial killer in a rain-soaked city. Must carry the weight of past failures and a relentless drive for justice.',
    created_at: '2024-07-29T11:04:00.000Z'
  },
  {
    id: 6,
    project_name: 'The Last Starship',
    character_name: 'Stoic Captain',
    age_range_min: 45,
    age_range_max: 60,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['dramatic range'],
    emotional_traits: ['authoritative', 'stoic', 'protective'],
    genre: 'sci-fi',
    description: 'The captain of humanity\'s last ark, making impossible decisions for the survival of the species. Requires a commanding presence.',
    created_at: '2024-07-29T11:05:00.000Z'
  },
  {
    id: 7,
    project_name: 'Mountain of Echoes',
    character_name: 'Grizzled Mountaineer',
    age_range_min: 50,
    age_range_max: 65,
    gender: 'male',
    physical_requirements: { build: 'average' },
    required_skills: ['survival skills', 'dramatic range'],
    emotional_traits: ['gruff', 'wise', 'reclusive'],
    genre: 'drama',
    description: 'A veteran mountaineer haunted by a past tragedy agrees to guide one last expedition. The role demands a rugged exterior with deep emotional currents.',
    created_at: '2024-07-29T11:06:00.000Z'
  },
  {
    id: 8,
    project_name: 'Royal Gambit',
    character_name: 'Cunning Queen',
    age_range_min: 30,
    age_range_max: 45,
    gender: 'female',
    physical_requirements: {},
    required_skills: ['dramatic range', 'accents'],
    emotional_traits: ['intelligent', 'manipulative', 'regal'],
    genre: 'drama',
    description: 'A queen in a historical court, using her intellect and wit to navigate political intrigue and secure her power. Requires a commanding yet subtle performance.',
    created_at: '2024-07-29T11:07:00.000Z'
  },
  {
    id: 9,
    project_name: 'Cyberpunk Ronin',
    character_name: 'Cybernetically-Enhanced Mercenary',
    age_range_min: 28,
    age_range_max: 38,
    gender: 'any',
    physical_requirements: { build: 'athletic' },
    required_skills: ['martial arts', 'stunts', 'sword fighting'],
    emotional_traits: ['cynical', 'intense', 'honorable'],
    genre: 'sci-fi',
    description: 'A street-smart mercenary in a neon-drenched futuristic city, taking on one last job. Must have extensive fight choreography experience.',
    created_at: '2024-07-29T11:08:00.000Z'
  },
  {
    id: 10,
    project_name: 'The Misfits Club',
    character_name: 'Awkward Teenager',
    age_range_min: 16,
    age_range_max: 19,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['comedy', 'dramatic range'],
    emotional_traits: ['awkward', 'relatable', 'witty'],
    genre: 'comedy',
    description: 'A coming-of-age story about a high school outcast trying to find their place. Requires a natural ability to balance humor with pathos.',
    created_at: '2024-07-29T11:09:00.000Z'
  },
  {
    id: 11,
    project_name: 'The Conductor',
    character_name: 'Obsessed Musical Genius',
    age_range_min: 40,
    age_range_max: 60,
    gender: 'male',
    physical_requirements: {},
    required_skills: ['piano', 'dramatic range'],
    emotional_traits: ['passionate', 'volatile', 'brilliant'],
    genre: 'drama',
    description: 'The story of a world-renowned conductor whose pursuit of perfection alienates everyone around him. Actor should have a background in music.',
    created_at: '2024-07-29T11:10:00.000Z'
  },
  {
    id: 12,
    project_name: 'Midnight Getaway',
    character_name: 'Charismatic Getaway Driver',
    age_range_min: 25,
    age_range_max: 35,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['stunts', 'improvisation'],
    emotional_traits: ['charming', 'reckless', 'cool'],
    genre: 'action',
    description: 'A skilled driver with a moral code finds themselves in over their head with a dangerous heist. Role requires confidence and charm under pressure.',
    created_at: '2024-07-29T11:11:00.000Z'
  },
  {
    id: 13,
    project_name: 'Whispers in the Bayou',
    character_name: 'Mysterious Recluse',
    age_range_min: 45,
    age_range_max: 60,
    gender: 'female',
    physical_requirements: {},
    required_skills: ['dramatic range', 'accents'],
    emotional_traits: ['enigmatic', 'haunting', 'protective'],
    genre: 'thriller',
    description: 'A woman with a dark past living in isolation in the Louisiana swamps becomes the key to solving a local mystery. Requires a powerful, non-verbal performance.',
    created_at: '2024-07-29T11:12:00.000Z'
  },
  {
    id: 14,
    project_name: 'Galaxy Racers',
    character_name: 'Cocky Pilot',
    age_range_min: 25,
    age_range_max: 35,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['comedy', 'improvisation'],
    emotional_traits: ['charismatic', 'arrogant', 'heroic'],
    genre: 'sci-fi',
    description: 'A hot-shot pilot in a futuristic racing league must learn to work with a team to win the championship. Star Wars-esque adventure.',
    created_at: '2024-07-29T11:13:00.000Z'
  },
  {
    id: 15,
    project_name: 'The Last Laugh',
    character_name: 'Aging Stand-up Comedian',
    age_range_min: 55,
    age_range_max: 70,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['comedy', 'dramatic range'],
    emotional_traits: ['cynical', 'vulnerable', 'witty'],
    genre: 'comedy',
    description: 'A once-famous comedian attempts a comeback tour, confronting their past failures and strained relationships. Requires experience in stand-up comedy.',
    created_at: '2024-07-29T11:14:00.000Z'
  },
  {
    id: 16,
    project_name: 'Codename: Nightingale',
    character_name: 'Undercover Spy',
    age_range_min: 28,
    age_range_max: 40,
    gender: 'female',
    physical_requirements: { build: 'athletic' },
    required_skills: ['martial arts', 'accents', 'stunts'],
    emotional_traits: ['adaptable', 'intelligent', 'ruthless'],
    genre: 'thriller',
    description: 'A deep-cover agent must extract a target from a hostile nation, blurring the lines between duty and morality. High-stakes action and psychological tension.',
    created_at: '2024-07-29T11:15:00.000Z'
  },
  {
    id: 17,
    project_name: 'First Contact',
    character_name: 'Brilliant Linguist',
    age_range_min: 35,
    age_range_max: 50,
    gender: 'female',
    physical_requirements: {},
    required_skills: ['dramatic range'],
    emotional_traits: ['intelligent', 'patient', 'introspective'],
    genre: 'sci-fi',
    description: 'A linguist is recruited by the military to communicate with a mysterious alien species that has arrived on Earth. Requires a deeply intellectual and emotional performance.',
    created_at: '2024-07-29T11:16:00.000Z'
  },
  {
    id: 18,
    project_name: 'The Baker Street Irregular',
    character_name: 'Street-smart Orphan',
    age_range_min: 18,
    age_range_max: 25,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['improvisation', 'accents'],
    emotional_traits: ['resourceful', 'witty', 'resilient'],
    genre: 'drama',
    description: 'A clever orphan in Victorian London who becomes the eyes and ears for a famous detective. Must be quick-witted and have a scrappy, survivalist energy.',
    created_at: '2024-07-29T11:17:00.000Z'
  },
  {
    id: 19,
    project_name: 'Tournament of Champions',
    character_name: 'Underdog Athlete',
    age_range_min: 20,
    age_range_max: 30,
    gender: 'any',
    physical_requirements: { build: 'athletic' },
    required_skills: ['boxing', 'stunts'],
    emotional_traits: ['determined', 'resilient', 'humble'],
    genre: 'drama',
    description: 'The story of an underdog boxer from a tough background who gets a once-in-a-lifetime shot at the title. Actor must be in excellent physical shape.',
    created_at: '2024-07-29T11:18:00.000Z'
  },
  {
    id: 20,
    project_name: 'The Magician\'s Apprentice',
    character_name: 'Skeptical Stage Magician',
    age_range_min: 30,
    age_range_max: 45,
    gender: 'any',
    physical_requirements: {},
    required_skills: ['sleight of hand', 'comedy'],
    emotional_traits: ['charming', 'skeptical', 'brilliant'],
    genre: 'fantasy',
    description: 'A charismatic but cynical stage magician discovers that real magic is not only real but also incredibly dangerous. Requires charm and comedic flair.',
    created_at: '2024-07-29T11:19:00.000Z'
  },
];


// This is a "hot-reload" safe way to keep the data in memory during development.
// In a real app, this would be a database.
declare global {
  var __db: {
    actors: Actor[];
    roles: Role[];
    dbState: {
      nextActorId: number;
      nextRoleId: number;
    };
  } | undefined;
}

// On first load, initialize the db, or use the existing one if it's already there.
if (!global.__db) {
  global.__db = {
    actors: [...initialActors],
    roles: [...initialRoles],
    dbState: {
      nextActorId: initialActors.length > 0 ? Math.max(...initialActors.map(a => a.id)) + 1 : 1,
      nextRoleId: initialRoles.length > 0 ? Math.max(...initialRoles.map(r => r.id)) + 1 : 1,
    },
  };
}

export const { actors, roles, dbState } = global.__db;

    